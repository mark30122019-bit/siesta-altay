import type { Metadata } from "next";
import { SITE_BASE_PATH } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "Алтай изнутри — агрегатор баз отдыха",
  description:
    "Подбор баз отдыха на Алтае от ООО «Сиеста Центр». Без внешних CDN и шрифтов.",
  icons: {
    icon: [
      { url: `${SITE_BASE_PATH}/favicon.ico`, sizes: "48x48" },
      { url: `${SITE_BASE_PATH}/icon`, type: "image/png", sizes: "32x32" },
    ],
    apple: `${SITE_BASE_PATH}/apple-icon`,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
