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

const templateType = getTemplateType("notices");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () => import(`@/templates/${CoreConfig.template}/notices/page.content`),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/notices/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

const notices = ContentsConfig.list.filter((item) => item.type === "notice");
const description = stripHtmlTags(
  notices.length > 0 ? notices[0].summary : "School notices and announcements.",
).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Notices",
  description,
  path: "/notices/",
  image: CoreConfig.logo || CoreConfig.logoIcon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/notices/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent noticesConfig={notices} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Notices",
          description,
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
