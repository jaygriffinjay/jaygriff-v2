import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // content/md and content/tsx are read/imported dynamically at runtime,
  // not statically — must be explicitly traced into every function bundle
  outputFileTracingIncludes: {
    "/**": ["./content/md/**/*", "./content/tsx/**/*"],
  },
};

export default nextConfig;
