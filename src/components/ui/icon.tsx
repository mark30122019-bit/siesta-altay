import * as React from "react";

import { cn } from "@/lib/utils";

/** Локальные инлайн-SVG — без Lucide / CDN / внешних спрайтов */
const icons = {
  bath: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h16" />
      <path d="M5 12v4a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-4" />
      <path d="M7 12V7a2 2 0 0 1 2-2h1" />
      <path d="M8 5h2" />
      <path d="M4 16h.01" />
      <path d="M20 16h.01" />
    </svg>
  ),
  pool: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 16c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
      <path d="M2 20c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
      <path d="M6 8V4h4v4" />
      <path d="M6 8h4" />
      <path d="M14 12V6h4" />
    </svg>
  ),
  water: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3c-2.5 3.5-6 7.2-6 11a6 6 0 0 0 12 0c0-3.8-3.5-7.5-6-11Z" />
      <path d="M9.5 15.5c.6.8 1.5 1.3 2.5 1.3" />
    </svg>
  ),
  wifi: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5a9 9 0 0 1 14 0" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0" />
      <path d="M12 19h.01" />
    </svg>
  ),
  fog: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10h12" />
      <path d="M6 14h14" />
      <path d="M4 18h10" />
      <path d="M8 6h9a3 3 0 0 1 0 6H7a3.5 3.5 0 1 1 .5-7 4.5 4.5 0 0 1 8.4 1.6" />
    </svg>
  ),
  mountains: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 20 7-12 4 7 2-3 5 8H3Z" />
      <path d="m10 12 2.5 4.5" />
    </svg>
  ),
  tree: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22v-7" />
      <path d="M12 15c-3.5 0-6-2.2-6-5.2C6 7 9 4 12 2c3 2 6 5 6 7.8 0 3-2.5 5.2-6 5.2Z" />
    </svg>
  ),
  map: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18 3 15.5V5.5L9 8" />
      <path d="m9 8 6-2.5L21 8v10l-6-2.5L9 18V8Z" />
      <path d="M15 5.5V15.5" />
    </svg>
  ),
  chevron: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  chevronDown: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  quote: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7.2 18c-1.8 0-3.2-.5-4.2-1.6C2 15.3 1.5 13.8 1.5 12c0-2 .6-3.8 1.8-5.3C4.5 5.1 6.2 4 8.4 3.4L9.2 5c-1.5.4-2.6 1.1-3.3 2-.7.9-1 1.9-1 3.1 0 .5.1.9.2 1.3.5-.3 1.1-.4 1.8-.4 1.1 0 2 .3 2.7 1 .7.6 1 1.5 1 2.6 0 1.1-.4 2-1.1 2.7-.8.7-1.8 1.1-3.3 1.1Zm10.5 0c-1.8 0-3.2-.5-4.2-1.6-1-1.1-1.5-2.6-1.5-4.4 0-2 .6-3.8 1.8-5.3C15 5.1 16.7 4 18.9 3.4L19.7 5c-1.5.4-2.6 1.1-3.3 2-.7.9-1 1.9-1 3.1 0 .5.1.9.2 1.3.5-.3 1.1-.4 1.8-.4 1.1 0 2 .3 2.7 1 .7.6 1 1.5 1 2.6 0 1.1-.4 2-1.1 2.7-.8.7-1.8 1.1-3.3 1.1Z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m12 3.2 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.5l-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L12 3.2Z" />
    </svg>
  ),
} as const;

export type IconName = keyof typeof icons;

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  size?: number;
  title?: string;
}

/**
 * Локальный SSR-компонент иконок (инлайн SVG, без CDN).
 * name: bath | pool | water | wifi | fog | mountains | tree | map | chevron | chevronDown | quote | star
 */
function Icon({ name, size = 24, className, title, ...props }: IconProps) {
  const svg = icons[name];

  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("inline-flex shrink-0 text-current [&_svg]:size-full", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {svg}
    </span>
  );
}

export { Icon, icons };
