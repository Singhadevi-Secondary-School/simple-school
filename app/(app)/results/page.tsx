import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { CoreConfig, ResultsConfig } from "@/configuration";
import { stripHtmlTags } from "@/lib/html";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../PageLoading";
import type { PageContentProps } from "./page.types";

const templateType = getTemplateType("results");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () => import(`@/templates/${CoreConfig.template}/results/page.content`),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/results/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

const description = stripHtmlTags(ResultsConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Results",
  description,
  path: "/results/",
  image: CoreConfig.logo || CoreConfig.logoIcon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/results/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent resultsConfig={ResultsConfig} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Results",
          description,
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
