import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { ContactConfig, CoreConfig, NavigationConfig } from "@/configuration";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../PageLoading";
import type { PageContentProps } from "./page.types";

const templateType = getTemplateType("contact");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () => import(`@/templates/${CoreConfig.template}/contact/page.content`),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/contact/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const metadata = createPageMetadata({
  title: "Contact & Feedback",
  description: ContactConfig.contactSummary,
  path: "/contact/",
  image: ContactConfig.contactImage || CoreConfig.logo || CoreConfig.logoIcon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/contact/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent
          contactConfig={ContactConfig}
          navigationConfig={NavigationConfig}
        />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact & Feedback",
          description: ContactConfig.contactSummary,
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
