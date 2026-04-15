import { ImageResponse } from "next/og";

export const runtime = "edge";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Generates a 1200x630 og:image.
// Visit /og in the browser to preview it.
export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        gap: 24,
        padding: 80,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${siteUrl}/logo.svg`}
        width={120}
        height={120}
        style={{ borderRadius: 24, objectFit: "contain" }}
        alt=""
      />

      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#fafafa",
          letterSpacing: -2,
          textAlign: "center",
        }}
      >
        Jay Griffin
      </div>

      <div
        style={{
          fontSize: 28,
          color: "#a1a1aa",
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Full-stack developer building modern web applications with React, Next.js, and TypeScript.
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
