import type { Metadata } from "next";
import { Suspense } from "react";

import { BasePageModeGate } from "@/components/base/base-page-mode-gate";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { SITE_SEO, absoluteAssetUrl, absoluteUrl } from "@/config/site";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { lodgingJsonLd } from "@/lib/seo";
import { isObjectListedForWeddings } from "@/lib/object-events";

type WeddingsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function findWeddingsObject(slug: string) {
  return GLOBAL_CONFIG.objects.find(
    (object) => object.slug === slug && isObjectListedForWeddings(object)
  );
}

function objectOgImage(slug: string) {
  const object = findWeddingsObject(slug);
  if (!object) return SITE_SEO.ogImage;
  return (
    object.seo.og_image ||
    object.tour.preview ||
    object.photos[0]?.src ||
    SITE_SEO.ogImage
  );
}

export function generateStaticParams() {
  return GLOBAL_CONFIG.objects
    .filter(isObjectListedForWeddings)
    .map((object) => ({ slug: object.slug }));
}

export async function generateMetadata({
  params,
}: WeddingsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const object = findWeddingsObject(slug);

  if (!object) {
    return {
      title: UI_CONFIG.base.notFoundTitle,
      robots: { index: false, follow: false },
    };
  }

  const url = absoluteUrl(`/weddings/${object.slug}`);
  const image = absoluteAssetUrl(objectOgImage(slug));
  const title = `${object.name} — свадьба`;
  const description =
    object.seo.description ||
    `Площадка для свадьбы: ${object.name}. Церемония, банкет, выкуп и заявка.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: [{ url: image, alt: object.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function WeddingsDetailPage({
  params,
}: WeddingsDetailPageProps) {
  const { slug } = await params;
  const object = findWeddingsObject(slug);

  if (!object) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <Typography variant="h2">{UI_CONFIG.base.notFoundTitle}</Typography>
        <Button variant="outline" href={UI_CONFIG.routing.weddings.href}>
          {UI_CONFIG.routing.weddings.label}
        </Button>
      </main>
    );
  }

  return (
    <>
      <JsonLdScript data={lodgingJsonLd(object)} />
      <Suspense fallback={<div className="min-h-screen bg-[#F4F0E8]" aria-hidden />}>
        <BasePageModeGate object={object} defaultMode="weddings" />
      </Suspense>
    </>
  );
}
