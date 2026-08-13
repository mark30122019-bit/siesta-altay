"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  DateRangePicker,
  type DateRangeValue,
} from "@/components/ui/date-range-picker";
import {
  isValidBookingName,
  NameInput,
} from "@/components/ui/name-input";
import { isCompletePhoneValue, PhoneInput } from "@/components/ui/phone-input";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

export function BookingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dates, setDates] = useState<DateRangeValue>({
    start: null,
    end: null,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidBookingName(name)) return;
    if (!isCompletePhoneValue(phone)) return;
    if (!dates.start || !dates.end) return;
    router.push("/spasibo");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-glass rounded-2xl p-6 md:p-8"
      autoComplete="on"
    >
      <Typography
        variant="h2"
        className="mb-7 text-center font-serif text-xl font-normal tracking-[0.04em] text-[#1A241C] md:text-2xl"
      >
        {UI_CONFIG.base.bookingTitle}
      </Typography>

      <div className="grid grid-cols-1 gap-3.5">
        <NameInput value={name} onChange={setName} name="name" required />
        <PhoneInput value={phone} onChange={setPhone} name="phone" required />
        <DateRangePicker
          value={dates}
          onChange={setDates}
          name="dates"
          required
        />
      </div>

      <Button
        variant="ghost"
        type="submit"
        className="btn-tactile mt-7 w-full rounded-xl border-0 bg-gradient-to-b from-[#4a4540] to-[#2c2925] py-3.5 font-sans text-[13px] font-semibold tracking-[0.08em] text-[#F7F3ED] shadow-[0_6px_20px_rgba(44,41,37,0.28)] hover:from-[#3d3832] hover:to-[#1f1d1a] hover:text-[#F7F3ED]"
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
