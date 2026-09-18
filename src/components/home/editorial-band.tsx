import type { ReactNode } from "react";

import { FadeIn } from "@/components/home/fade-in";
import { cn } from "@/lib/utils";

export function EditorialBand({
  id,
  reverse = false,
  text,
  visual,
  className,
}: {
  id?: string;
  reverse?: boolean;
  text: ReactNode;
  visual: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-10 py-20 md:py-24 lg:py-28",
        className
      )}
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-6 md:gap-12 lg:grid-cols-2 lg:gap-x-14 lg:px-10 xl:px-12">
        <FadeIn
          className={cn("min-w-0", reverse ? "lg:order-2" : "lg:order-1")}
        >
          {text}
        </FadeIn>
        <FadeIn
          delay={0.06}
          className={cn("min-w-0", reverse ? "lg:order-1" : "lg:order-2")}
        >
          {visual}
        </FadeIn>
      </div>
    </section>
  );
}
