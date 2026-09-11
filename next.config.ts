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
  /** Локально `localhost:3000/` → `/siesta-altay/` (иначе 404 из‑за basePath). */
  async redirects() {
    return [
      {
        source: "/",
        destination: SITE_BASE_PATH,
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
