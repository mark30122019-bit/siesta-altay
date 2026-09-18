import type { ReactNode } from "react";
import Link from "next/link";

import { EditorialBand } from "@/components/home/editorial-band";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { UI_CONFIG } from "@/config/uiConfig";
import { assetPath } from "@/config/site";

const WEDDINGS_VISUAL = "/media/usadba-kruglovyh/01.webp";

const underVisualLinkClass =
  "mt-5 inline-flex gap-1.5 font-sans text-[16px] font-semibold tracking-wide text-[#BC5434] transition-colors hover:text-[#a8482c]";

function PointRow({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start">
      <Icon name="chevron" size={28} className="shrink-0 text-stone-400" />
      <div className="min-w-0">{children}</div>
    </li>
  );
}

export function WeddingsIntroSection() {
  const copy = UI_CONFIG.home;

  return (
    <EditorialBand
      id="weddings"
      reverse
      text={
        <div className="max-w-xl lg:max-w-none">
          <p className="mb-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-[#8A8278]">
            {copy.weddingsIntroEyebrow}
          </p>
          <Typography
            variant="h2"
            className="mb-5 font-serif text-3xl font-normal leading-[1.15] tracking-wide text-[#1A241C] md:text-4xl lg:text-[2.75rem]"
          >
            {copy.weddingsIntroTitle}
          </Typography>
          <Typography
            variant="body"
            className="mb-3 text-base font-medium leading-[1.7] text-[#2A2A24] md:text-lg"
          >
            {copy.weddingsIntroLead}
          </Typography>
          <Typography
            variant="body"
            className="mb-8 text-sm leading-[1.7] text-[#555] md:text-[15px]"
          >
            {copy.weddingsIntroBody}
          </Typography>
          <ul className="space-y-2">
            {copy.weddingsIntroPoints.map((point) => (
              <PointRow key={point}>
                <Typography
                  variant="body"
                  className="text-sm leading-[1.7] text-[#1A241C]"
                >
                  {point}
                </Typography>
              </PointRow>
            ))}
          </ul>
        </div>
      }
      visual={
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#EDE8E0] md:aspect-[5/6]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetPath(WEDDINGS_VISUAL)}
              alt=""
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,18,0.15)_0%,rgba(18,24,18,0.45)_55%,rgba(18,24,18,0.72)_100%)]"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
                {UI_CONFIG.weddings.title}
              </p>
              <p className="mt-2 max-w-sm font-serif text-xl leading-snug tracking-wide text-white md:text-2xl">
                {copy.weddingsIntroVisualCaption}
              </p>
            </div>
          </div>
          <Link
            href={UI_CONFIG.routing.weddings.href}
            className={underVisualLinkClass}
          >
            {copy.weddingsIntroCta}
            <span aria-hidden>›</span>
          </Link>
        </div>
      }
    />
  );
}
