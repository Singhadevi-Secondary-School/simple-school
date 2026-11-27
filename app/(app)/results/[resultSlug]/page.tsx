import { join } from "node:path";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { CoreConfig, ResultsConfig } from "@/configuration";
import { readConfigurationFromFile } from "@/configuration/configurationFiles";
import {
  type TOutput as ResultOutput,
  buildSchema as resultSchema,
} from "@/configuration/result";
import { stripHtmlTags } from "@/lib/html";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../../PageLoading";
import type { PageContentProps, ResultDetail } from "./page.types";

const templateType = getTemplateType("results/[resultSlug]");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(
            `@/templates/${CoreConfig.template}/results/[resultSlug]/page.content`
          ),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/results/[resultSlug]/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = ResultsConfig.results
    .flatMap((x) => x.slugs)
    .map((x) => x.slug);

  return [
    ...slugs.map((slug) => ({ resultSlug: slug })),
    { resultSlug: "__404__" },
  ];
}

const emptyResult: ResultOutput = {
  description: "",
  attachments: [],
  individualResults: [],
};
function findResult(resultSlug: string) {
  const metadata = ResultsConfig.results.find(
    (result) => result.slugs.findIndex((x) => x.slug === resultSlug) !== -1,
  );
  if (!metadata) {
    return null;
  }

  let details: ResultOutput;
  try {
    details = resultSchema.parse(
      readConfigurationFromFile(join("results", `${metadata.id}.json`)),
    ) as ResultOutput;
  } catch {
    details = emptyResult;
  }

  return {
    ...metadata,
    ...details,
  } as ResultDetail;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resultSlug: string }>;
}) {
  const { resultSlug } = await params;
  const result = findResult(resultSlug);
  if (!result) {
    return {};
  }

  return createPageMetadata({
    title: result.title,
    description: stripHtmlTags(result.description || result.title).slice(
      0,
      300,
    ),
    path: `/results/${resultSlug}/`,
    image: CoreConfig.logo || CoreConfig.logoIcon,
  });
}

async function Page({ params }: { params: Promise<{ resultSlug: string }> }) {
  const { resultSlug } = await params;
  if (!PageContent) {
    notFound();
  }
  const result = findResult(resultSlug);
  if (!result) {
    notFound();
  }

  const canonical = getCanonicalUrl(`/results/${resultSlug}/`);
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent result={result} schoolName={CoreConfig.schoolName} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ScholarlyArticle",
          headline: result.title,
          description: stripHtmlTags(result.description || result.title).slice(
            0,
            300,
          ),
          ...(canonical ? { url: canonical } : {}),
          author: { "@type": "Organization", name: CoreConfig.schoolName },
        }}
      />
    </>
  );
}

export default Page;
