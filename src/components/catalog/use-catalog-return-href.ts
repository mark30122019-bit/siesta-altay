"use client";

import { useEffect, useState } from "react";

import {
  CATALOG_PATH,
  readCatalogReturnHref,
} from "@/lib/catalog-filter-state";

export function useCatalogReturnHref() {
  const [href, setHref] = useState<string>(CATALOG_PATH);

  useEffect(() => {
    setHref(readCatalogReturnHref());
  }, []);

  return href;
}
