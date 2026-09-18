import type { ReactNode } from "react";

import { CatalogListingCard } from "@/components/catalog/catalog-listing-card";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import type { BaseObject } from "@/types";

/**
 * Server-rendered shell for /catalog.
 * Used as Suspense fallback while CatalogCanvas (useSearchParams) hydrates —
 * so View Source / crawlers see object cards in HTML, not an empty page.
 */
export function CatalogStaticShell({ objects }: { objects: BaseObject[] }) {
  return (
    <div className="px-4 pt-8 pb-[15vh] md:px-[5vw] md:pt-10 md:pb-[17vh]">
      <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2 lg:grid-cols-5 lg:gap-2.5">
        <StaticFilterCard title={UI_CONFIG.filters.forWhom}>
          <ul className="flex min-h-[80px] flex-wrap content-start gap-1.5">
            {GLOBAL_CONFIG.filters.forWhom.map((item) => (
              <li
                key={item.slug}
                className="rounded-full bg-[#F0EBE3] px-3 py-1.5 font-sans text-[13px] text-[#6B635A] md:px-2.5 md:py-1 md:text-xs"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </StaticFilterCard>

        <StaticFilterCard title={UI_CONFIG.filters.region}>
          <ul className="flex min-h-[80px] flex-col gap-3">
            {GLOBAL_CONFIG.filters.regions.map((item) => (
              <li
                key={item.slug}
                className="font-sans text-[13px] text-[#555] md:text-xs"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </StaticFilterCard>

        <StaticFilterCard title={UI_CONFIG.filters.district}>
          <Typography
            variant="caption"
            className="text-[12px] text-[#8A8278] md:text-[11px]"
          >
            {UI_CONFIG.catalog.selectRegionHint}
          </Typography>
        </StaticFilterCard>

        <StaticFilterCard title={UI_CONFIG.filters.features}>
          <ul className="grid min-h-[80px] grid-cols-2 content-start gap-x-3 gap-y-2">
            {GLOBAL_CONFIG.filters.features.slice(0, 6).map((item) => (
              <li
                key={item.slug}
                className="font-sans text-[13px] text-[#555] md:text-xs"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </StaticFilterCard>

        <StaticFilterCard title={UI_CONFIG.filters.viewMode}>
          <p className="font-sans text-[13px] text-[#555] md:text-xs">
            {UI_CONFIG.filters.list}
          </p>
        </StaticFilterCard>
      </div>

      <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {objects.map((object) => (
          <li key={object.slug}>
            <CatalogListingCard object={object} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function StaticFilterCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="surface-glass flex flex-col px-3 py-2.5 md:px-3.5 md:py-2.5">
      <Typography
        variant="caption"
        className="mb-3 text-[13px] font-bold tracking-wide text-[#1A241C] md:text-xs"
      >
        {title}
      </Typography>
      {children}
    </div>
  );
}
