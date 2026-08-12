import type { NextConfig } from "next";

/**
 * GitHub Pages: https://mark30122019-bit.github.io/siesta-altay/
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/siesta-altay",
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
