import type { Metadata } from "next";

import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Typography",
  robots: { index: false, follow: false },
};

export default function TestTypographyPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] px-4 py-12">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <section className="space-y-2 border-b border-[#1A241C]/15 pb-6">
          <p className="font-sans text-xs uppercase tracking-wide text-gray-500">
            variant: h1
          </p>
          <Typography variant="h1">Глэмпинг «Воздух»</Typography>
        </section>

        <section className="space-y-2 border-b border-[#1A241C]/15 pb-6">
          <p className="font-sans text-xs uppercase tracking-wide text-gray-500">
            variant: h2
          </p>
          <Typography variant="h2">от 29 000 ₽/сут</Typography>
          <Typography variant="h2">Честно от автора</Typography>
        </section>

        <section className="space-y-2 border-b border-[#1A241C]/15 pb-6">
          <p className="font-sans text-xs uppercase tracking-wide text-gray-500">
            variant: h3
          </p>
          <Typography variant="h3">Усадьба Вельвет</Typography>
        </section>

        <section className="space-y-2 border-b border-[#1A241C]/15 pb-6">
          <p className="font-sans text-xs uppercase tracking-wide text-gray-500">
            variant: lead
          </p>
          <Typography variant="lead">
            ЗАГЛУШКА. Краткое описание — 2-3 предложения. Что это за место по
            ощущению и чем оно отличается от соседних.
          </Typography>
        </section>

        <section className="space-y-2 border-b border-[#1A241C]/15 pb-6">
          <p className="font-sans text-xs uppercase tracking-wide text-gray-500">
            variant: body
          </p>
          <Typography variant="body">
            КОММЕНТАРИЙ О ДЕТЯХ: Критически важно — отдых с детьми здесь может
            быть затруднен из-за ограничений по безопасности, крутого рельефа
            местности и отсутствия детских ограждений.
          </Typography>
        </section>

        <section className="space-y-2">
          <p className="font-sans text-xs uppercase tracking-wide text-gray-500">
            variant: caption
          </p>
          <Typography variant="caption">
            Чемальский район · посёлок Узнезя · 90 км от Горно-Алтайска
          </Typography>
        </section>
      </div>
    </main>
  );
}
