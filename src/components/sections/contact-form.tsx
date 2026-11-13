"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { CircleAlert, CircleCheck, Loader, Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { contactFormCopy, contactFormFields } from "@/data/contact";
import {
  contactApiMessages,
  contactHoneypotField,
  firstInvalidField,
  hasContactErrors,
  parseContactSubmission,
  validateContactField,
} from "@/lib/contact";
import { isEmailJsConfigured, sendViaEmailJs } from "@/lib/emailjs";
import { cn } from "@/lib/utils";
import type {
  ContactFieldErrors,
  ContactFieldName,
  ContactSubmission,
} from "@/types/portfolio";

/**
 * The contact form.
 *
 * Client-side because a form is a conversation: it has to answer while someone
 * is still typing, hold the button down while a request is in flight, and say
 * what happened when the request returns. The rules it applies on blur are the
 * ones the route handler applies again — imported, not re-implemented.
 *
 * Three things it deliberately does not do. It never announces a success it did
 * not receive. It never clears what someone wrote because sending failed — a
 * message that vanishes is a message that gets written again or abandoned. And
 * it never shows a provider's words: every sentence here is written for the
 * person reading it.
 */

const emptySubmission: ContactSubmission = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  /** The published address, when one exists. Absent means no fallback row. */
  email: string | null;
}

export function ContactForm({ email }: ContactFormProps) {
  const formId = useId();
  const [values, setValues] = useState<ContactSubmission>(emptySubmission);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [notice, setNotice] = useState<string | null>(null);

  const controls = useRef<
    Partial<
      Record<ContactFieldName, HTMLInputElement | HTMLTextAreaElement | null>
    >
  >({});
  const honeypot = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  /**
   * Move focus to the confirmation once it exists.
   *
   * This matters because the form is submitted by a button outside it at the
   * bottom of the section: focusing the confirmation is what brings it into
   * view for someone whose cursor is nowhere near the form, and it announces
   * the outcome for anyone not watching the fields. Done in an effect because
   * the panel does not exist yet while the submit handler is still running.
   */
  useEffect(() => {
    if (status !== "success") return;
    successRef.current?.focus();
  }, [status]);

  const controlId = (name: ContactFieldName) => `${formId}-${name}`;
  const hintId = (name: ContactFieldName) => `${formId}-${name}-hint`;
  const errorId = (name: ContactFieldName) => `${formId}-${name}-error`;
  const honeypotId = `${formId}-reference`;

  /**
   * Failure copy, chosen by what happened and by whether a second route exists.
   *
   * 429 and 503 have their own sentences because they mean something a visitor
   * can act on. Everything else — a network drop, a 502, anything unplanned —
   * gets one generic sentence, because a status code is not an explanation.
   */
  function failureCopy(responseStatus: number): string {
    if (responseStatus === 429) return contactApiMessages.rateLimited;

    if (responseStatus === 503) {
      return email
        ? contactFormCopy.unavailableWithEmail
        : contactFormCopy.unavailable;
    }

    return email ? contactFormCopy.failureWithEmail : contactFormCopy.failure;
  }

  function setFieldError(name: ContactFieldName, message: string | undefined) {
    setErrors((current) => {
      const next = { ...current };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  }

  function handleChange(name: ContactFieldName, value: string) {
    setValues((current) => ({ ...current, [name]: value }));

    // Cleared the moment they start fixing it: a message that outlives the value
    // it described is a message about something that is no longer there.
    setFieldError(name, undefined);

    // Either banner describes the send that just happened; once they are
    // writing the next message, it is stale. The fields themselves were already
    // cleared on success, so this leaves a blank form with nothing said about
    // the previous one.
    if (status === "error" || status === "success") {
      setStatus("idle");
      setNotice(null);
    }
  }

  /**
   * On blur, but only once there is something to judge.
   *
   * Validating a field someone merely tabbed past turns a form into a scold.
   * Submitting still checks everything, including the fields nobody touched.
   */
  function handleBlur(name: ContactFieldName) {
    if (!values[name] && !errors[name]) return;
    setFieldError(name, validateContactField(name, values[name]));
  }

  function focusFirstInvalid(problems: ContactFieldErrors) {
    const first = firstInvalidField(problems);
    if (first) controls.current[first]?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // One request at a time: a double click must not become two messages.
    if (status === "submitting") return;

    const { value, errors: validationErrors } = parseContactSubmission(values);

    if (hasContactErrors(validationErrors)) {
      setErrors(validationErrors);
      setStatus("idle");
      setNotice(null);
      focusFirstInvalid(validationErrors);
      return;
    }

    setErrors({});
    setNotice(null);
    setStatus("submitting");

    try {
      // EmailJS first: it sends straight from the browser, so a visitor's
      // message does not depend on a server key being configured. The route
      // handler below remains the fallback when EmailJS is not set up.
      if (isEmailJsConfigured) {
        const delivered = await sendViaEmailJs(value);

        if (delivered) {
          // Cleared the instant the provider accepts it: the fields are the
          // message, and the message is now somewhere else.
          setValues(emptySubmission);
          setErrors({});
          setStatus("success");
          setNotice(contactFormCopy.successMessage);
          return;
        }

        setStatus("error");
        setNotice(failureCopy(502));
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...value,
          // Always empty for a person filling the form by hand.
          [contactHoneypotField]: honeypot.current?.value ?? "",
        }),
      });

      const body = (await response.json().catch(() => null)) as {
        success?: boolean;
        errors?: ContactFieldErrors;
      } | null;

      if (response.ok && body?.success) {
        // Cleared only on success. A failed send keeps every word.
        setValues(emptySubmission);
        setErrors({});
        setStatus("success");
        setNotice(contactFormCopy.successMessage);
        return;
      }

      const serverErrors = body?.errors ?? {};
      setErrors(serverErrors);

      if (hasContactErrors(serverErrors)) {
        // The server disagreed about a field, so the message belongs under that
        // field rather than in a panel about sending. Reaching this means client
        // validation was bypassed; it is handled because "cannot happen" is not
        // a design.
        setStatus("idle");
        setNotice(null);
        focusFirstInvalid(serverErrors);
        return;
      }

      setStatus("error");
      setNotice(failureCopy(response.status));
    } catch {
      // Offline, DNS, a proxy that swallowed the request: one sentence, and
      // their message stays exactly where it is.
      setStatus("error");
      setNotice(failureCopy(0));
    }
  }

  /**
   * One ref callback for both control kinds.
   *
   * A plain `ref` object per field would not survive the input/textarea branch,
   * and focus has to be movable to the first field that needs attention, so the
   * nodes are collected by name instead.
   */
  function register(name: ContactFieldName) {
    return (node: HTMLInputElement | HTMLTextAreaElement | null) => {
      controls.current[name] = node;
    };
  }

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={status === "submitting"}
      className="relative flex scroll-mt-24 flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          {contactFormCopy.title}
        </h3>
        <p className="max-w-lg text-[13px] leading-relaxed text-muted-foreground">
          {contactFormCopy.description}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {contactFormFields.map((field) => {
          const message = errors[field.name];
          const describedBy =
            [
              field.hint ? hintId(field.name) : null,
              message ? errorId(field.name) : null,
            ]
              .filter(Boolean)
              .join(" ") || undefined;

          // The border carries the invalid state as well as the message below,
          // so the field is still identifiable when the text is not read.
          const controlClassName = cn(
            "w-full rounded-lg border bg-input/50 px-3.5 py-2.5 text-[14px] leading-relaxed text-foreground transition-colors duration-200 placeholder:text-foreground-subtle focus-visible:border-accent-cyan/70",
            message
              ? "border-destructive/70"
              : "border-border hover:border-border-strong",
          );

          const sharedProps = {
            id: controlId(field.name),
            name: field.name,
            required: true,
            maxLength: field.maxLength,
            placeholder: field.placeholder,
            value: values[field.name],
            "aria-invalid": Boolean(message),
            "aria-describedby": describedBy,
            onChange: (
              event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => handleChange(field.name, event.target.value),
            onBlur: () => handleBlur(field.name),
          };

          return (
            <div key={field.name} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor={controlId(field.name)}
                  className="text-[13px] font-medium tracking-tight text-foreground"
                >
                  {field.label}
                  {/* The `required` attribute is what assistive technology
                      announces; this mark is only so it is visible too. */}
                  <span aria-hidden="true" className="ml-1 text-accent-violet-soft">
                    *
                  </span>
                </label>

                {field.name === "message" ? (
                  <span className="font-mono text-[10.5px] tabular-nums text-foreground-subtle">
                    {values.message.length}/{field.maxLength}
                  </span>
                ) : null}
              </div>

              {field.control === "textarea" ? (
                <textarea
                  {...sharedProps}
                  ref={register(field.name)}
                  rows={6}
                  className={cn(controlClassName, "min-h-36 resize-y")}
                />
              ) : (
                <input
                  {...sharedProps}
                  ref={register(field.name)}
                  type={field.type ?? "text"}
                  autoComplete={field.autoComplete}
                  className={controlClassName}
                />
              )}

              {field.hint ? (
                <p
                  id={hintId(field.name)}
                  className="text-[12px] leading-relaxed text-foreground-subtle"
                >
                  {field.hint}
                </p>
              ) : null}

              {message ? (
                <p
                  id={errorId(field.name)}
                  className="flex items-start gap-1.5 text-[12.5px] leading-relaxed text-destructive"
                >
                  <CircleAlert
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0"
                  />
                  {message}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Honeypot. Off-screen, out of the tab order, and named for something
          browser autofill has no opinion about. A script that fills every field
          fills this one, and the handler discards anything that does. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={honeypotId}>Leave this field empty</label>
        <input
          ref={honeypot}
          id={honeypotId}
          name={contactHoneypotField}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader aria-hidden="true" className="animate-spin" />
              {contactFormCopy.pendingLabel}
            </>
          ) : (
            <>
              <Send aria-hidden="true" />
              {contactFormCopy.submitLabel}
            </>
          )}
        </Button>

        <p className="text-[12px] text-foreground-subtle">
          {contactFormCopy.requiredNote}
        </p>
      </div>

      {/* Success. A live region, so it is announced rather than only shown. */}
      {status === "success" && notice ? (
        <p
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="flex items-start gap-2.5 rounded-lg border border-accent-emerald/30 bg-accent-emerald/[0.08] px-4 py-3 text-[13px] leading-relaxed text-accent-emerald-soft"
        >
          <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{notice}</span>
        </p>
      ) : null}

      {/* Failure. An alert, because it interrupts something the visitor asked
          for — and it leaves their words in place in the fields above. */}
      {status === "error" && notice ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/[0.08] px-4 py-3 text-[13px] leading-relaxed text-foreground"
        >
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-destructive"
          />
          <span className="flex flex-col gap-1">
            <span>{notice}</span>
            {email ? (
              <span className="text-[12.5px] text-muted-foreground">
                Or write to{" "}
                <a
                  href={`mailto:${email}`}
                  className="text-accent-cyan-soft underline decoration-dotted underline-offset-2 hover:text-foreground"
                >
                  {email}
                </a>
                .
              </span>
            ) : null}
          </span>
        </div>
      ) : null}

      <p className="text-[12px] leading-relaxed text-foreground-subtle">
        {contactFormCopy.privacyNote}
      </p>

      {/* The direct alternative, rendered only when there is a real address to
          offer. A form that can fail should never be the last word on how to
          get in touch — but pointing at an inbox that does not exist would be
          worse than offering nothing. */}
      {email ? (
        <div className="flex flex-col gap-1.5 border-t border-border pt-5">
          <h4 className="text-[13px] font-medium tracking-tight text-foreground">
            {contactFormCopy.emailFallbackTitle}
          </h4>
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">
            {contactFormCopy.emailFallbackNote}
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-1 inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 font-mono text-[12px] text-foreground transition-colors duration-200 hover:border-accent-cyan/40 hover:text-accent-cyan-soft"
          >
            <Mail aria-hidden="true" className="size-3.5" />
            {email}
          </a>
        </div>
      ) : null}
    </form>
  );
}
