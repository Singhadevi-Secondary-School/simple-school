import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { CoreConfig, HomeConfig } from "@/configuration";
import {
  createPageMetadata,
  getCanonicalUrl,
  getSiteName,
} from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "./PageLoading";
import type { PageContentProps } from "./page.types";

const templateType = getTemplateType("home");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () => import(`@/templates/${CoreConfig.template}/home/page.content`),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((await import(`@/templates/${CoreConfig.template}/home/page.content`))
          .default as React.ComponentType<PageContentProps>)
      : null;

const pageMeta = createPageMetadata({
  title: getSiteName(),
  description: CoreConfig.seoDescription || HomeConfig.heroDescription,
  path: "/",
  image: HomeConfig.heroPicture || CoreConfig.logo || CoreConfig.logoIcon,
  keywords: CoreConfig.seoKeywords,
});

export const metadata = {
  ...pageMeta,
  title: {
    absolute: getSiteName(),
  },
};

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent coreConfig={CoreConfig} homeConfig={HomeConfig} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: CoreConfig.schoolName,
          description: CoreConfig.seoDescription || HomeConfig.heroDescription,
          ...(canonical ? { url: canonical } : {}),
          image:
            HomeConfig.heroPicture || CoreConfig.logo || CoreConfig.logoIcon,
          mainEntity: {
            "@type": "School",
            name: CoreConfig.schoolName,
            image:
              HomeConfig.heroPicture || CoreConfig.logo || CoreConfig.logoIcon,
            description: HomeConfig.heroDescription,
          },
        }}
      />
    </>
  );
}

export default Page;
