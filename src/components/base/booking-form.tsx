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
      className="rounded-xl border border-stone-200 bg-[#FBFBFA] p-6"
    >
      <Typography variant="h2" className="mb-4 text-center">
        {UI_CONFIG.base.bookingTitle}
      </Typography>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>

      <div className="mt-4">
        <Input
          type="text"
          name="dates"
          placeholder={UI_CONFIG.base.placeholders.dates}
          value={dates}
          onChange={(event) => setDates(event.target.value)}
          required
          className="w-full"
        />
      </div>

      <Button variant="fill" type="submit" className="mt-6 w-full">
        {`${UI_CONFIG.base.submitPrefix} ${GLOBAL_CONFIG.companyName}`}
      </Button>
    </form>
  );
}
