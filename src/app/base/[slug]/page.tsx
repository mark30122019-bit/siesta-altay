import type { Metadata } from "next";

import { BasePageCanvas } from "@/components/base/base-page-canvas";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

type BaseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function findPublishedObject(slug: string) {
  return GLOBAL_CONFIG.objects.find(
    (object) => object.slug === slug && object.status === "published"
  );
}

export async function generateMetadata({
  params,
}: BaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const object = findPublishedObject(slug);

  if (!object) {
    return {
      title: UI_CONFIG.base.notFoundTitle,
    };
  }

  return {
    title: object.seo.title,
    description: object.seo.description,
  };
}

export default async function BaseDetailPage({ params }: BaseDetailPageProps) {
  const { slug } = await params;
  const object = findPublishedObject(slug);

  if (!object) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FBFBFA] px-4">
        <Typography variant="h2">{UI_CONFIG.base.notFoundTitle}</Typography>
        <Button variant="outline" href="/">
          {UI_CONFIG.base.backHome}
        </Button>
      </main>
    );
  }

  return <BasePageCanvas object={object} />;
}
