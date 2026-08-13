import type { Metadata } from "next";

import { BasePageCanvas } from "@/components/base/base-page-canvas";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { SITE_SEO, absoluteAssetUrl, absoluteUrl } from "@/config/site";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { lodgingJsonLd } from "@/lib/seo";

type BaseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function findPublishedObject(slug: string) {
  return GLOBAL_CONFIG.objects.find(
    (object) => object.slug === slug && object.status === "published"
  );
}

function objectOgImage(slug: string) {
  const object = findPublishedObject(slug);
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
    .filter((object) => object.status === "published")
    .map((object) => ({ slug: object.slug }));
}

export async function generateMetadata({
  params,
}: BaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const object = findPublishedObject(slug);

  if (!object) {
    return {
      title: UI_CONFIG.base.notFoundTitle,
      robots: { index: false, follow: false },
    };
  }

  const url = absoluteUrl(`/base/${object.slug}`);
  const image = absoluteAssetUrl(objectOgImage(slug));
  const title = object.seo.title;
  const description = object.seo.description;

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
      images: [
        {
          url: image,
          alt: object.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BaseDetailPage({ params }: BaseDetailPageProps) {
  const { slug } = await params;
  const object = findPublishedObject(slug);

  if (!object) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <Typography variant="h2">{UI_CONFIG.base.notFoundTitle}</Typography>
        <Button variant="outline" href={UI_CONFIG.routing.home.href}>
          {UI_CONFIG.routing.home.label}
        </Button>
      </main>
    );
  }

  return (
    <>
      <JsonLdScript data={lodgingJsonLd(object)} />
      <BasePageCanvas object={object} />
    </>
  );
}
