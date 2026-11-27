import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { ContentsConfig, CoreConfig } from "@/configuration";
import { stripHtmlTags } from "@/lib/html";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../PageLoading";
import type { PageContentProps } from "./page.types";

const templateType = getTemplateType("publications");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(
            `@/templates/${CoreConfig.template}/publications/page.content`
          ),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/publications/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

const publications = ContentsConfig.list.filter(
  (item) => item.type === "publication",
);
const description = stripHtmlTags(
  publications.length > 0
    ? publications[0].summary
    : "School publications and articles.",
).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Publications",
  description,
  path: "/publications/",
  image: CoreConfig.logo || CoreConfig.logoIcon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/publications/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent publicationsConfig={publications} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Publications",
          description,
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
