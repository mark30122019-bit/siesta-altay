"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { UI_CONFIG } from "@/config/uiConfig";

type CatalogEmptyStateProps = {
  onReset: () => void;
};

export function CatalogEmptyState({ onReset }: CatalogEmptyStateProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 flex min-h-[calc(100dvh-19rem)] flex-col items-center justify-center pb-[15vh] md:min-h-[calc(100dvh-17.5rem)] md:pb-[17vh]"
      aria-live="polite"
    >
      <div className="relative flex w-full max-w-lg flex-col items-center overflow-hidden rounded-2xl border border-[#E8E0D4]/90 bg-[#f8f8f0] px-8 py-14 text-center shadow-[0_16px_48px_rgba(42,36,28,0.045)] md:px-12 md:py-16">
        <div
          className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[#E8ECDF]/60 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 size-44 rounded-full bg-[#F8E9E4]/50 blur-2xl"
          aria-hidden
        />

        <div className="relative mb-6 flex size-[4.5rem] items-center justify-center rounded-full border border-[#E8E0D4] bg-[#F4F0E8] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <Icon name="mountains" size={34} className="text-[#5c6b3a]" />
        </div>

        <Typography
          variant="h2"
          className="relative font-serif text-2xl font-normal tracking-[0.02em] text-[#1A241C] md:text-[1.75rem]"
        >
          {UI_CONFIG.catalog.empty}
        </Typography>

        <Typography
          variant="body"
          className="relative mt-3 max-w-sm text-[15px] leading-relaxed text-[#6B635A] md:text-base"
        >
          {UI_CONFIG.catalog.emptySubtitle}
        </Typography>

        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={onReset}>
            {UI_CONFIG.catalog.emptyReset}
          </Button>
        </div>

        <div
          className="relative mt-10 flex items-center gap-3 text-[#C4BBB0]"
          aria-hidden
        >
          <span className="h-px w-12 bg-current" />
          <Icon name="tree" size={18} />
          <span className="h-px w-12 bg-current" />
        </div>
      </div>
    </motion.section>
  );
}
