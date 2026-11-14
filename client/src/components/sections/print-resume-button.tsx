"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Opens the browser print dialog so the on-site resume can be saved as PDF.
 * Client-side by nature — `window` is only touched inside the event handler,
 * so server rendering stays safe.
 */
export function PrintResumeButton() {
  return (
    <Button variant="primary" size="sm" onClick={() => window.print()}>
      <Printer aria-hidden="true" />
      Download as PDF
    </Button>
  );
}
