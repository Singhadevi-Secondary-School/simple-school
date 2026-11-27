import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { CoreConfig, GrievanceConfig } from "@/configuration";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../PageLoading";
import type { PageContentProps } from "./page.types";

const templateType = getTemplateType("grievance");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(`@/templates/${CoreConfig.template}/grievance/page.content`),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/grievance/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const metadata = createPageMetadata({
  title: "Grievance & Contact",
  description: GrievanceConfig.contactSummary,
  path: "/grievance/",
  image: GrievanceConfig.contactImage || CoreConfig.logo || CoreConfig.logoIcon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/grievance/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent grievanceConfig={GrievanceConfig} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Grievance & Contact",
          description: GrievanceConfig.contactSummary,
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
