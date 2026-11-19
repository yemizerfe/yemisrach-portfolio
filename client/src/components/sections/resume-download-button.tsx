"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadResumePdf } from "@/lib/resume-pdf";

/**
 * Downloads the résumé as a one-page A4 PDF.
 *
 * The document is generated in the browser (see `lib/resume-pdf.ts`), so there
 * is no print dialog to fight with and no server round trip — the button hands
 * the visitor a file that already matches the CV.
 */
export function ResumeDownloadButton() {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);

    try {
      await downloadResumePdf();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="primary" size="sm" onClick={handleClick} disabled={busy} aria-busy={busy}>
      {busy ? (
        <Loader2 aria-hidden="true" className="animate-spin" />
      ) : (
        <Download aria-hidden="true" />
      )}
      {busy ? "Preparing PDF…" : "Download as PDF"}
    </Button>
  );
}
