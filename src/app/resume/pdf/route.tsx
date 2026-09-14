import { renderToBuffer } from "@react-pdf/renderer";

import { ResumeDocument } from "../resume-document";

/**
 * Rendered per request. It's pure JS with no browser, so this is cheap — and
 * caching a prerendered copy means edits to the document silently don't show
 * up, which is worse than the few milliseconds it costs to rebuild.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const pdf = await renderToBuffer(<ResumeDocument />);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="jay-griffin-resume.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
