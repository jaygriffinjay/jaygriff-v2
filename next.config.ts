import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // content/md and content/tsx are read/imported dynamically at runtime,
  // not statically — must be explicitly traced into every function bundle
  outputFileTracingIncludes: {
    "/**": ["./content/md/**/*", "./content/tsx/**/*"],
    // public/ is served by the CDN and isn't in the function bundle, but the
    // resume PDF reads this font off disk while rendering
    "/resume/pdf": ["./public/Sekuya-Regular.ttf"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "assets.jaygriff.com" }],
  },
  async redirects() {
    return [{ source: "/faq", destination: "/about", permanent: true }];
  },
};

export default nextConfig;
