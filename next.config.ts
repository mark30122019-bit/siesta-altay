import type { NextConfig } from "next";
import { SITE_BASE_PATH } from "./src/config/site";

/**
 * GitHub Pages: https://mark30122019-bit.github.io/siesta-altay/
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: SITE_BASE_PATH,
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
