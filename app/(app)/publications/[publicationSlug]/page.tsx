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
import type { PageContentProps, PublicationItem } from "./page.types";

const templateType = getTemplateType("publications/[publicationSlug]");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(
            `@/templates/${CoreConfig.template}/publications/[publicationSlug]/page.content`
          ),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/publications/[publicationSlug]/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const dynamicParams = false;

export function generateStaticParams() {
  const publications = ContentsConfig.list.filter(
    (item) => item.type === "publication",
  );
  const slugs = publications.flatMap((x) => x.slugs).map((x) => x.slug);

  return [
    ...slugs.map((slug) => ({ publicationSlug: slug })),
    { publicationSlug: "__404__" },
  ];
}

const emptyContent: ContentOutput = { content: "" };
function findPublication(publicationSlug: string) {
  const publications = ContentsConfig.list.filter(
    (item) => item.type === "publication",
  );
  const metadata = publications.find(
    (item) => item.slugs.findIndex((x) => x.slug === publicationSlug) !== -1,
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
  } as PublicationItem;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicationSlug: string }>;
}) {
  const { publicationSlug } = await params;
  const publication = findPublication(publicationSlug);
  if (!publication) {
    return {};
  }

  return createPageMetadata({
    title: publication.title,
    description: stripHtmlTags(
      publication.summary || publication.content,
    ).slice(0, 300),
    path: `/publications/${publicationSlug}/`,
    image: publication.coverImage || CoreConfig.logo || CoreConfig.logoIcon,
    keywords: publication.category ? [publication.category] : undefined,
    type: "article",
    publishedTime: publication.date,
  });
}

async function Page({
  params,
}: {
  params: Promise<{ publicationSlug: string }>;
}) {
  const { publicationSlug } = await params;
  if (!PageContent) {
    notFound();
  }
  const publication = findPublication(publicationSlug);
  if (!publication) {
    notFound();
  }

  const canonical = getCanonicalUrl(`/publications/${publicationSlug}/`);
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent
          publication={publication}
          schoolName={CoreConfig.schoolName}
        />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: publication.title,
          description: stripHtmlTags(
            publication.summary || publication.content,
          ).slice(0, 300),
          datePublished: publication.date,
          ...(publication.coverImage ? { image: publication.coverImage } : {}),
          ...(canonical ? { url: canonical } : {}),
          author: { "@type": "Organization", name: CoreConfig.schoolName },
        }}
      />
    </>
  );
}

export default Page;
