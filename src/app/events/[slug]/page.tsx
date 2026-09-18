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
import { isObjectListedForEvents } from "@/lib/object-events";

type EventsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function findEventsObject(slug: string) {
  return GLOBAL_CONFIG.objects.find(
    (object) => object.slug === slug && isObjectListedForEvents(object)
  );
}

function objectOgImage(slug: string) {
  const object = findEventsObject(slug);
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
    .filter(isObjectListedForEvents)
    .map((object) => ({ slug: object.slug }));
}

export async function generateMetadata({
  params,
}: EventsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const object = findEventsObject(slug);

  if (!object) {
    return {
      title: UI_CONFIG.base.notFoundTitle,
      robots: { index: false, follow: false },
    };
  }

  const url = absoluteUrl(`/events/${object.slug}`);
  const image = absoluteAssetUrl(objectOgImage(slug));
  const title = `${object.name} — мероприятия`;
  const description =
    object.seo.description ||
    `Площадка для корпоратива и мероприятий: ${object.name}. Залы, рассадка, кейтеринг и заявка.`;

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

export default async function EventsDetailPage({
  params,
}: EventsDetailPageProps) {
  const { slug } = await params;
  const object = findEventsObject(slug);

  if (!object) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <Typography variant="h2">{UI_CONFIG.base.notFoundTitle}</Typography>
        <Button variant="outline" href={UI_CONFIG.routing.corporate.href}>
          {UI_CONFIG.routing.corporate.label}
        </Button>
      </main>
    );
  }

  return (
    <>
      <JsonLdScript data={lodgingJsonLd(object)} />
      <Suspense fallback={<div className="min-h-screen bg-[#F4F0E8]" aria-hidden />}>
        <BasePageModeGate object={object} defaultMode="events" />
      </Suspense>
    </>
  );
}
