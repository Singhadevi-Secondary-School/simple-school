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
import type { NoticeItem, PageContentProps } from "./page.types";

const templateType = getTemplateType("notices/[noticeSlug]");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(
            `@/templates/${CoreConfig.template}/notices/[noticeSlug]/page.content`
          ),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/notices/[noticeSlug]/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const dynamicParams = false;

export function generateStaticParams() {
  const notices = ContentsConfig.list.filter((item) => item.type === "notice");
  const slugs = notices.flatMap((x) => x.slugs).map((x) => x.slug);

  return [
    ...slugs.map((slug) => ({ noticeSlug: slug })),
    { noticeSlug: "__404__" },
  ];
}

const emptyContent: ContentOutput = { content: "" };
function findNotice(noticeSlug: string) {
  const notices = ContentsConfig.list.filter((item) => item.type === "notice");
  const metadata = notices.find(
    (item) => item.slugs.findIndex((x) => x.slug === noticeSlug) !== -1,
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
  } as NoticeItem;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ noticeSlug: string }>;
}) {
  const { noticeSlug } = await params;
  const notice = findNotice(noticeSlug);
  if (!notice) {
    return {};
  }

  return createPageMetadata({
    title: notice.title,
    description: stripHtmlTags(notice.summary || notice.content).slice(0, 300),
    path: `/notices/${noticeSlug}/`,
    image: CoreConfig.logo || CoreConfig.logoIcon,
    keywords: notice.category ? [notice.category] : undefined,
    type: "article",
    publishedTime: notice.date,
  });
}

async function Page({ params }: { params: Promise<{ noticeSlug: string }> }) {
  const { noticeSlug } = await params;
  if (!PageContent) {
    notFound();
  }
  const notice = findNotice(noticeSlug);
  if (!notice) {
    notFound();
  }

  const canonical = getCanonicalUrl(`/notices/${noticeSlug}/`);
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent notice={notice} schoolName={CoreConfig.schoolName} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: notice.title,
          description: stripHtmlTags(notice.summary || notice.content).slice(
            0,
            300,
          ),
          datePublished: notice.date,
          ...(canonical ? { url: canonical } : {}),
          author: { "@type": "Organization", name: CoreConfig.schoolName },
        }}
      />
    </>
  );
}

export default Page;
