"use client";

import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Chrome derives the default "Save as PDF" filename from the document title. */
const PDF_FILENAME = "jay-griffin-resume";

/** Printed links have to point somewhere real, not at whatever host printed them. */
const SITE_URL = "https://jaygriff.com";

/** Opens the browser print dialog, where "Save as PDF" produces the resume PDF. */
export function PrintButton({ className }: { className?: string }) {
  function openPrintDialog() {
    const pageTitle = document.title;
    document.title = PDF_FILENAME;

    // Chrome carries anchors into the PDF as clickable annotations, but a
    // relative href has no base once the file leaves the browser — so send
    // absolute URLs to the printer and put the originals back afterwards.
    const relativeLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')
    ).map((element) => ({ element, href: element.getAttribute("href")! }));

    for (const { element, href } of relativeLinks) {
      element.setAttribute("href", `${SITE_URL}${href}`);
    }

    window.addEventListener(
      "afterprint",
      () => {
        document.title = pageTitle;
        for (const { element, href } of relativeLinks) {
          element.setAttribute("href", href);
        }
      },
      { once: true }
    );

    window.print();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={openPrintDialog}
    >
      <DownloadIcon />
      Download PDF
    </Button>
  );
}
