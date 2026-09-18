"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CorporateListingCard } from "@/components/corporate/corporate-listing-card";
import { Typography } from "@/components/ui/typography";
import { UI_CONFIG } from "@/config/uiConfig";
import {
  EVENTS_CAPACITY_FILTERS,
  getEventsCapacityMax,
  matchesEventsCapacityFilter,
  type EventsCapacityFilterSlug,
} from "@/lib/object-events";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

const cardMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

type CapacitySelection = EventsCapacityFilterSlug | "all";

export function CorporateCanvas({ objects }: { objects: BaseObject[] }) {
  const [capacity, setCapacity] = useState<CapacitySelection>("all");
  const copy = UI_CONFIG.corporate;

  const filtered = useMemo(() => {
    if (capacity === "all") return objects;
    return objects.filter((object) =>
      matchesEventsCapacityFilter(getEventsCapacityMax(object), capacity)
    );
  }, [objects, capacity]);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-10 md:px-[10vw] md:pb-20 md:pt-12">
      <header className="mb-8 max-w-2xl md:mb-10">
        <Typography
          variant="caption"
          className="mb-3 block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D4A24A]"
        >
          {UI_CONFIG.routing.corporate.label}
        </Typography>
        <Typography
          variant="h1"
          className="font-sans text-[1.75rem] font-semibold tracking-wide text-[#F2F0EA] sm:text-3xl md:text-4xl"
        >
          {copy.title}
        </Typography>
        <Typography
          variant="body"
          className="mt-3 text-[15px] leading-relaxed text-[#A8A49A] md:text-base"
        >
          {copy.subtitle}
        </Typography>
        <Typography
          variant="caption"
          className="mt-4 block text-[13px] leading-relaxed text-[#7A766C]"
        >
          {copy.lead}
        </Typography>
      </header>

      <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <Typography
          variant="caption"
          className="font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8A867C]"
        >
          {copy.capacityFilter}
        </Typography>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={copy.capacityFilter}
        >
          <CapacityChip
            label={copy.capacityAll}
            active={capacity === "all"}
            onClick={() => setCapacity("all")}
          />
          {EVENTS_CAPACITY_FILTERS.map((item) => (
            <CapacityChip
              key={item.slug}
              label={item.label}
              active={capacity === item.slug}
              onClick={() => setCapacity(item.slug)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-[#151A17] px-6 py-14 text-center">
          <Typography
            variant="h3"
            className="font-sans text-lg font-semibold text-[#E8E6E1]"
          >
            {copy.empty}
          </Typography>
          <Typography
            variant="body"
            className="mx-auto mt-2 max-w-md text-[14px] text-[#9A968C]"
          >
            {copy.emptySubtitle}
          </Typography>
          <button
            type="button"
            onClick={() => setCapacity("all")}
            className="mt-6 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#D4A24A] transition-colors hover:text-[#E8C06A]"
          >
            {copy.emptyReset}
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((object) => (
              <motion.li
                key={object.slug}
                layout
                {...cardMotion}
                className="list-none"
              >
                <CorporateListingCard object={object} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

function CapacityChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-md border px-3.5 py-2 font-sans text-[13px] font-medium tracking-wide transition-colors",
        active
          ? "border-[#D4A24A]/70 bg-[#D4A24A]/15 text-[#F2F0EA]"
          : "border-white/15 bg-transparent text-[#B8B3A8] hover:border-white/30 hover:text-[#E8E6E1]"
      )}
    >
      {label}
    </button>
  );
}
