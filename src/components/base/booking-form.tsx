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
      className="rounded-xl border border-stone-200/90 bg-white p-5 shadow-sm md:p-6"
    >
      <Typography
        variant="h2"
        className="mb-5 text-center text-xl font-bold text-[#1A241C] md:text-2xl"
      >
        {UI_CONFIG.base.bookingTitle}
      </Typography>

      <div className="grid grid-cols-1 gap-3">
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
            className="pr-10"
          />
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
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
        className="mt-5 w-full border border-stone-300 bg-stone-200 font-semibold text-[#1A241C] hover:bg-stone-300 hover:text-[#1A241C]"
      >
        {UI_CONFIG.base.submitCta}
      </Button>

      <Typography
        variant="caption"
        className="mt-3 block text-center text-[11px] leading-snug text-[#555]"
      >
        {`${UI_CONFIG.base.bookingNotePrefix} ${GLOBAL_CONFIG.companyName}`}
      </Typography>
    </form>
  );
}
