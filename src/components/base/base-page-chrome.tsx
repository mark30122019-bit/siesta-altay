"use client";

import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { useCatalogReturnHref } from "@/components/catalog/use-catalog-return-href";
import { UI_CONFIG } from "@/config/uiConfig";
import {
  isEventsLikeMode,
  type BasePageMode,
} from "@/lib/base-page-mode";

export function BasePageHeader({ mode = "leisure" }: { mode?: BasePageMode }) {
  const catalogBackHref = useCatalogReturnHref();

  if (isEventsLikeMode(mode)) {
    const routing =
      mode === "weddings"
        ? UI_CONFIG.routing.weddings
        : UI_CONFIG.routing.corporate;

    return (
      <SiteHeader
        backHref={routing.href}
        backLabel={routing.backLabel}
        showNav
        activeNav={mode === "weddings" ? "weddings" : "corporate"}
      />
    );
  }

  return (
    <SiteHeader
      backHref={catalogBackHref}
      backLabel={UI_CONFIG.routing.catalog.backLabel}
    />
  );
}

export function BasePageFooter() {
  return <SiteFooter />;
}
