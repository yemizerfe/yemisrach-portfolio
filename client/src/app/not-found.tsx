import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow mb-4">404 — Not found</p>
      <h1 className="text-gradient animate-text-sheen text-3xl font-medium tracking-tight sm:text-4xl">
        This route doesn’t exist.
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        The page you requested was moved or never existed. The case studies and
        the rest of the portfolio are one click away.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">Back to portfolio</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/#projects">View projects</Link>
        </Button>
      </div>
    </div>
  );
}
