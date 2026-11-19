/**
 * The résumé as a real PDF, built in the browser.
 *
 * The CV is typeset with jsPDF rather than screenshotted, so the download has
 * selectable text, working links and a small file — and it is laid out to land
 * on exactly one A4 page. The content is read from `data/resume.ts`, the same
 * source the on-screen page renders, so the download and the page can never
 * drift apart.
 *
 * jsPDF is imported dynamically: it is only needed once someone clicks the
 * button, so it stays out of the page's initial bundle.
 */

import { resume } from "@/data/resume";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 12;
const CONTENT_W = PAGE_W - MARGIN * 2;

const INK: [number, number, number] = [17, 20, 27];
const MUTED: [number, number, number] = [92, 100, 116];
const RULE: [number, number, number] = [190, 197, 212];

const BODY = 9.2;
const BODY_STEP = 3.85;
const BULLET_STEP = 3.7;

export const RESUME_PDF_FILENAME = "Yemisrach-Zerfe-Backend-Engineer-CV.pdf";

interface Segment {
  text: string;
  style?: "normal" | "bold" | "italic";
  size?: number;
  color?: [number, number, number];
  href?: string;
}

/** Builds the one-page A4 résumé and returns it as a PDF blob. */
export async function buildResumePdf(): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });

  doc.setProperties({
    title: `${resume.name} — ${resume.headline}`,
    subject: "Resume",
    author: resume.name,
    keywords:
      "Backend Engineer, Node.js, Express.js, TypeScript, Python, FastAPI, PostgreSQL, MongoDB, REST APIs",
    creator: resume.name,
  });

  let y = MARGIN + 4.4;

  const setFont = (size: number, style: "normal" | "bold" | "italic" = "normal") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  };

  /** One line assembled from segments; wraps to a second line if it must. */
  const row = (segments: Segment[], after = BODY_STEP) => {
    let x = MARGIN;

    for (const segment of segments) {
      setFont(segment.size ?? BODY, segment.style);
      const width = doc.getTextWidth(segment.text);

      if (x + width > PAGE_W - MARGIN && x > MARGIN) {
        y += after;
        x = MARGIN;
      }

      doc.setTextColor(...(segment.color ?? INK));
      if (segment.href) doc.textWithLink(segment.text, x, y, { url: segment.href });
      else doc.text(segment.text, x, y);

      x += width;
    }

    y += after;
  };

  /** A titled block closed by a hairline, the CV's section treatment. */
  const section = (title: string) => {
    y += 2.4;
    setFont(9.6, "bold");
    doc.setTextColor(...INK);
    doc.text(title.toUpperCase(), MARGIN, y, { charSpace: 0.45 });

    y += 1.7;
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);

    y += 4.3;
  };

  const paragraph = (value: string, indent = 0) => {
    setFont(BODY);
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(value, CONTENT_W - indent) as string[];
    doc.text(lines, MARGIN + indent, y);
    y += lines.length * BODY_STEP;
  };

  const bullet = (value: string) => {
    const indent = 3.8;
    setFont(BODY);
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(value, CONTENT_W - indent) as string[];
    doc.text("•", MARGIN + 0.3, y);
    doc.text(lines, MARGIN + indent, y);
    y += lines.length * BULLET_STEP;
  };

  const skill = (label: string, items: string) => {
    const labelText = `${label}:`;

    setFont(BODY, "bold");
    doc.setTextColor(...INK);
    doc.text(labelText, MARGIN, y);

    const x = MARGIN + doc.getTextWidth(labelText) + 1.4;
    setFont(BODY);
    const lines = doc.splitTextToSize(items, PAGE_W - MARGIN - x) as string[];
    doc.text(lines, x, y);
    y += lines.length * BULLET_STEP;
  };

  // --- Header ---------------------------------------------------------
  setFont(17, "bold");
  doc.setTextColor(...INK);
  doc.text(resume.name.toUpperCase(), MARGIN, y, { charSpace: 0.5 });
  y += 5.6;

  row(
    [
      { text: resume.headline, style: "bold", size: 8.8 },
      { text: "  |  ", color: MUTED, size: 8.8 },
      { text: resume.location, size: 8.8 },
      { text: "  |  ", color: MUTED, size: 8.8 },
      { text: resume.phone, size: 8.8, href: resume.phoneHref },
      { text: "  |  ", color: MUTED, size: 8.8 },
      { text: resume.email, size: 8.8, href: `mailto:${resume.email}` },
    ],
    4.2,
  );

  row(
    resume.links.flatMap((link, index) => [
      ...(index > 0 ? [{ text: "  |  ", color: MUTED, size: 8.8 }] : []),
      { text: link.label, style: "bold" as const, size: 8.8, href: link.href },
    ]),
    4.0,
  );

  y += 0.8;
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 4.6;

  // --- Professional Summary -------------------------------------------
  section("Professional Summary");
  paragraph(resume.summary);

  // --- Technical Skills -----------------------------------------------
  section("Technical Skills");
  resume.skills.forEach((item) => skill(item.label, item.items));

  // --- Professional Experience ----------------------------------------
  section("Professional Experience");
  resume.experience.forEach((role, index) => {
    if (index > 0) y += 2.2;

    row([
      { text: `${role.title} — ${role.organisation}`, style: "bold", size: 9.6 },
      { text: `  |  ${role.location}`, color: MUTED },
      ...(role.meta ? [{ text: `  |  ${role.meta}`, style: "italic" as const, color: MUTED }] : []),
    ]);

    y += 0.5;
    role.bullets.forEach(bullet);
  });

  // --- Key Project Experience -----------------------------------------
  section("Key Project Experience");
  resume.projects.forEach((project, index) => {
    if (index > 0) y += 2.2;

    row([
      { text: `${project.name} — ${project.summary}`, style: "bold", size: 9.6 },
      { text: "  |  ", color: MUTED },
      { text: "GitHub", href: project.href },
      { text: `  |  ${project.stack}`, style: "italic", color: MUTED },
    ]);

    y += 0.5;
    project.bullets.forEach(bullet);
  });

  // --- Education ------------------------------------------------------
  section("Education");
  row([
    { text: resume.education.degree, style: "bold" },
    { text: "  |  ", color: MUTED },
    { text: resume.education.institution },
    { text: "  |  ", color: MUTED },
    { text: resume.education.detail },
  ]);

  if (y > PAGE_H - MARGIN) {
    console.warn(
      `[resume-pdf] Content overflows the page by ${(y - (PAGE_H - MARGIN)).toFixed(1)}mm.`,
    );
  }

  return doc.output("blob");
}

/** Builds the PDF and hands it to the browser as a download. */
export async function downloadResumePdf(): Promise<void> {
  const blob = await buildResumePdf();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = RESUME_PDF_FILENAME;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
