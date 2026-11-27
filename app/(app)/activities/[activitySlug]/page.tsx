import { join } from "node:path";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { ContentsConfig, CoreConfig } from "@/configuration";
import { readConfigurationFromFile } from "@/configuration/configurationFiles";
import {
  type TOutput as ContentOutput,
  buildSchema as contentSchema,
} from "@/configuration/content";
import { stripHtmlTags } from "@/lib/html";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../../PageLoading";
import type { ActivityItem, PageContentProps } from "./page.types";

const templateType = getTemplateType("activities/[activitySlug]");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(
            `@/templates/${CoreConfig.template}/activities/[activitySlug]/page.content`
          ),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/activities/[activitySlug]/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const dynamicParams = false;

export function generateStaticParams() {
  const activities = ContentsConfig.list.filter(
    (item) => item.type === "activity",
  );
  const slugs = activities.flatMap((x) => x.slugs).map((x) => x.slug);

  return [
    ...slugs.map((slug) => ({ activitySlug: slug })),
    { activitySlug: "__404__" },
  ];
}

const emptyContent: ContentOutput = { content: "" };
function findActivity(activitySlug: string) {
  const activities = ContentsConfig.list.filter(
    (item) => item.type === "activity",
  );
  const metadata = activities.find(
    (item) => item.slugs.findIndex((x) => x.slug === activitySlug) !== -1,
  );
  if (!metadata) {
    return null;
  }

  let content: ContentOutput;
  try {
    content = contentSchema.parse(
      readConfigurationFromFile(join("contents", `${metadata.id}.json`)),
    ) as ContentOutput;
  } catch {
    content = emptyContent;
  }

  return {
    ...metadata,
    ...content,
  } as ActivityItem;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ activitySlug: string }>;
}) {
  const { activitySlug } = await params;
  const activity = findActivity(activitySlug);
  if (!activity) {
    return {};
  }

  return createPageMetadata({
    title: activity.title,
    description: stripHtmlTags(activity.summary || activity.content).slice(
      0,
      300,
    ),
    path: `/activities/${activitySlug}/`,
    image: activity.coverImage || CoreConfig.logo || CoreConfig.logoIcon,
    keywords: activity.category ? [activity.category] : undefined,
    type: "article",
    publishedTime: activity.date,
  });
}

async function Page({ params }: { params: Promise<{ activitySlug: string }> }) {
  const { activitySlug } = await params;
  if (!PageContent) {
    notFound();
  }
  const activity = findActivity(activitySlug);
  if (!activity) {
    notFound();
  }

  const canonical = getCanonicalUrl(`/activities/${activitySlug}/`);
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent activity={activity} schoolName={CoreConfig.schoolName} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: activity.title,
          description: stripHtmlTags(
            activity.summary || activity.content,
          ).slice(0, 300),
          startDate: activity.date,
          ...(activity.coverImage ? { image: activity.coverImage } : {}),
          ...(canonical ? { url: canonical } : {}),
          organizer: { "@type": "Organization", name: CoreConfig.schoolName },
        }}
      />
    </>
  );
}

export default Page;
