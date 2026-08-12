"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

import heroImage from "../../../public/media/hero/home.webp";

export function HeroBackground() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(145deg,#c5bfb2_0%,#8a9a8e_50%,#5c6b6e_100%)] transition-opacity duration-700 ease-out motion-reduce:transition-none",
          isLoaded ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        <div className="absolute inset-0 motion-safe:animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.14)_50%,rgba(255,255,255,0.04)_100%)]" />
      </div>

      <Image
        src={heroImage}
        alt=""
        fill
        priority
        fetchPriority="high"
        placeholder="blur"
        sizes="100vw"
        quality={85}
        className={cn(
          "object-cover object-center transition-opacity duration-700 ease-out motion-reduce:transition-none",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoadingComplete={() => setIsLoaded(true)}
      />
    </div>
  );
}
