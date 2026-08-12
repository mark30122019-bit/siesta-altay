"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

export function BookingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dates, setDates] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/spasibo");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#E8E0D4]/80 bg-[#f8f8f0] p-6 shadow-[0_24px_60px_rgba(42,36,28,0.06)] md:p-8"
    >
      <Typography
        variant="h2"
        className="mb-7 text-center font-serif text-xl font-normal tracking-[0.04em] text-[#1A241C] md:text-2xl"
      >
        {UI_CONFIG.base.bookingTitle}
      </Typography>

      <div className="grid grid-cols-1 gap-3.5">
        <Input
          type="text"
          name="name"
          placeholder={UI_CONFIG.base.placeholders.name}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <Input
          type="tel"
          name="phone"
          placeholder={UI_CONFIG.base.placeholders.phone}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
        <div className="relative">
          <Input
            type="text"
            name="dates"
            placeholder={UI_CONFIG.base.placeholders.dates}
            value={dates}
            onChange={(event) => setDates(event.target.value)}
            required
            className="pr-11"
          />
          <span
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A89F94]"
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-4"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 11h18" />
            </svg>
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        type="submit"
        className="mt-7 w-full rounded-md border-0 bg-[#3D3832] py-3.5 font-sans text-[13px] font-semibold tracking-[0.08em] text-[#F7F3ED] hover:bg-[#2C2925] hover:text-[#F7F3ED]"
      >
        {UI_CONFIG.base.submitCta}
      </Button>

      <Typography
        variant="caption"
        className="mt-4 block text-center text-[11px] leading-relaxed text-[#8A8278]"
      >
        {`${UI_CONFIG.base.bookingNotePrefix} ${GLOBAL_CONFIG.companyName}`}
      </Typography>
    </form>
  );
}
