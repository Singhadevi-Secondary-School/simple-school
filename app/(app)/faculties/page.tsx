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

const templateType = getTemplateType("faculties");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(`@/templates/${CoreConfig.template}/faculties/page.content`),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/faculties/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

const facultiesConfig = {
  ...OrganizationsConfig,
  organizations: OrganizationsConfig.organizations.filter(
    (org) => org.type === "Faculty",
  ),
};

const description = stripHtmlTags(
  `View academic faculties and departments within ${CoreConfig.schoolName}.`,
);

export const metadata = createPageMetadata({
  title: "Faculties",
  description,
  path: "/faculties/",
  image: CoreConfig.logo || CoreConfig.logoIcon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/faculties/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent facultiesConfig={facultiesConfig} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Faculties",
          description,
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
