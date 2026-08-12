import type { NextConfig } from "next";

/**
 * GitHub Pages: https://mark30122019-bit.github.io/siesta-altay/
 * Для личного домена уберите basePath (или задайте пустую строку) и пересоберите.
 */
const basePath = "/siesta-altay";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
