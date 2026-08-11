import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "font-serif text-4xl font-semibold tracking-tight md:text-5xl",
      h2: "font-serif text-3xl font-semibold tracking-tight md:text-4xl",
      h3: "font-serif text-2xl font-medium tracking-tight md:text-3xl",
      body: "font-sans text-base leading-relaxed text-foreground",
      caption: "font-sans text-sm leading-normal text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>;

const defaultElement: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  caption: "span",
};

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

/**
 * SSR-компонент типографики.
 * Заголовки — font-serif (системный стек с засечками), body/caption — font-sans.
 */
function Typography({
  className,
  variant = "body",
  as,
  ...props
}: TypographyProps) {
  const Comp = as ?? defaultElement[variant ?? "body"];

  return (
    <Comp
      className={cn(typographyVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Typography, typographyVariants };
