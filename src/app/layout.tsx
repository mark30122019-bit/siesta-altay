import type { Metadata } from "next";

import {
  SITE_BASE_PATH,
  SITE_SEO,
  SITE_URL,
  absoluteAssetUrl,
  absoluteUrl,
} from "@/config/site";
import {
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: SITE_SEO.titleDefault,
    template: SITE_SEO.titleTemplate,
  },
  description: SITE_SEO.description,
  keywords: [...SITE_SEO.keywords],
  authors: [{ name: SITE_SEO.companyName }],
  creator: SITE_SEO.companyName,
  publisher: SITE_SEO.companyName,
  applicationName: SITE_SEO.brandName,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: SITE_SEO.locale,
    url: absoluteUrl("/"),
    siteName: SITE_SEO.brandName,
    title: SITE_SEO.titleDefault,
    description: SITE_SEO.description,
    images: [
      {
        url: absoluteAssetUrl(SITE_SEO.ogImage),
        width: 1200,
        height: 630,
        alt: `${SITE_SEO.brandName} — базы отдыха на Алтае`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_SEO.titleDefault,
    description: SITE_SEO.description,
    images: [absoluteAssetUrl(SITE_SEO.ogImage)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: `${SITE_BASE_PATH}/favicon.ico`, sizes: "48x48" },
      { url: `${SITE_BASE_PATH}/icon`, type: "image/png", sizes: "32x32" },
    ],
    apple: `${SITE_BASE_PATH}/apple-icon`,
  },
  category: "travel",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <JsonLdScript data={[websiteJsonLd(), organizationJsonLd()]} />
        {children}
      </body>
    </html>
  );
}
