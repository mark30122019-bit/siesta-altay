import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Алтай изнутри — агрегатор баз отдыха",
  description:
    "Подбор баз отдыха на Алтае от ООО «Сиеста Центр». Без внешних CDN и шрифтов.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
