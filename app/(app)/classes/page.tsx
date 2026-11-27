import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { CoreConfig, OrganizationsConfig } from "@/configuration";
import { stripHtmlTags } from "@/lib/html";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../PageLoading";
import type { PageContentProps } from "./page.types";

const templateType = getTemplateType("classes");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () => import(`@/templates/${CoreConfig.template}/classes/page.content`),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/classes/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

const classesConfig = {
  ...OrganizationsConfig,
  organizations: OrganizationsConfig.organizations.filter(
    (org) => org.type === "Class",
  ),
};

const description = stripHtmlTags(`View classes in ${CoreConfig.schoolName}.`);

export const metadata = createPageMetadata({
  title: "Classes",
  description,
  path: "/classes/",
  image: CoreConfig.logo || CoreConfig.logoIcon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/classes/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent classesConfig={classesConfig} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Classes",
          description,
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
