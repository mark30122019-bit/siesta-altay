"use client";

import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { useCatalogReturnHref } from "@/components/catalog/use-catalog-return-href";
import { UI_CONFIG } from "@/config/uiConfig";

export function BasePageHeader() {
  const backHref = useCatalogReturnHref();

  return (
    <SiteHeader
      backHref={backHref}
      backLabel={UI_CONFIG.routing.catalog.backLabel}
    />
  );
}

export function BasePageFooter() {
  const backHref = useCatalogReturnHref();

  return (
    <SiteFooter
      sideLink={{
        href: backHref,
        label: UI_CONFIG.routing.catalog.backLabel,
      }}
    />
  );
}
