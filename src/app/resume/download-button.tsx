import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Links straight at the generated PDF. The `download` attribute names the file
 * rather than leaving it to the browser, and works the same on every platform
 * — unlike the print dialog, which laid out per-device.
 */
export function DownloadButton({ className }: { className?: string }) {
  return (
    <Button asChild variant="outline" size="sm" className={className}>
      <a href="/resume/pdf" download="jay-griffin-resume.pdf">
        <DownloadIcon />
        Download PDF
      </a>
    </Button>
  );
}
