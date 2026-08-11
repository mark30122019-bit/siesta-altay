import Link from "next/link";

import { GLOBAL_CONFIG } from "@/config";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[78vh] w-full items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-[linear-gradient(160deg,#1a3a42_0%,#3d6b72_38%,#7a9e8a_68%,#c4b59a_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(255,255,255,0.12),transparent_55%)]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/25" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center">
        <p className="absolute left-6 top-8 font-sans text-sm tracking-wide text-white/90 md:left-0 md:top-10">
          {GLOBAL_CONFIG.companyName.replace(" Центр", "")}
        </p>

        <h1 className="mt-16 max-w-4xl font-serif text-4xl font-normal uppercase tracking-[0.08em] text-white md:mt-8 md:text-5xl lg:text-6xl">
          Современный отдых на Алтае
        </h1>

        <Link
          href="#catalog"
          className="mt-10 inline-flex items-center justify-center rounded-full border border-white/90 bg-transparent px-8 py-3 font-sans text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-white/10"
        >
          Выбрать локацию
        </Link>
      </div>
    </section>
  );
}
