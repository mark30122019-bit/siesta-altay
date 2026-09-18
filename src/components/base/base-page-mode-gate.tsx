"use client";

import { useSearchParams } from "next/navigation";

import { BasePageCanvas } from "@/components/base/base-page-canvas";
import {
  parseBasePageMode,
  type BasePageMode,
} from "@/lib/base-page-mode";
import type { BaseObject } from "@/types";

export function BasePageModeGate({
  object,
  defaultMode = "leisure",
}: {
  object: BaseObject;
  defaultMode?: BasePageMode;
}) {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("for");
  const mode = fromQuery ? parseBasePageMode(fromQuery) : defaultMode;

  return <BasePageCanvas object={object} mode={mode} />;
}
