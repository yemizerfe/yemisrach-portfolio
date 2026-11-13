import type { CodeSnippet as CodeSnippetData } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface CodeSnippetProps {
  snippet: CodeSnippetData;
  className?: string;
}

/**
 * A short, representative code sample.
 *
 * No syntax highlighter is used on purpose: the site ships no highlighting
 * dependency, and an unhighlighted sample that is genuinely from the project
 * says more than a convincingly coloured one that is not. The header carries
 * the file the sample comes from, so a claim can always be located.
 */
export function CodeSnippet({ snippet, className }: CodeSnippetProps) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/25 px-4 py-2.5">
        <span className="font-mono text-[11.5px] tracking-tight text-foreground">
          {snippet.filename}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-subtle">
          {snippet.language}
        </span>
      </div>

      {/* A visible scrollbar is kept here on purpose: a long line that cannot be
          seen must at least be discoverable. */}
      <pre className="overflow-x-auto px-4 py-4">
        <code className="font-mono text-[12px] leading-[1.7] text-muted-foreground">
          {snippet.code}
        </code>
      </pre>

      {snippet.caption ? (
        <figcaption className="border-t border-border px-4 py-3 text-[12px] leading-relaxed text-foreground-subtle">
          {snippet.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

interface CodeSnippetListProps {
  snippets: CodeSnippetData[];
  className?: string;
}

export function CodeSnippetList({ snippets, className }: CodeSnippetListProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {snippets.map((snippet) => (
        <CodeSnippet key={snippet.filename} snippet={snippet} />
      ))}
    </div>
  );
}
