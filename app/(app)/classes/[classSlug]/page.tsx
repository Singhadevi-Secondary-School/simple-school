import { join } from "node:path";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { CoreConfig, OrganizationsConfig, PeopleConfig } from "@/configuration";
import { readConfigurationFromFile } from "@/configuration/configurationFiles";
import {
  type TOutput as OrganizationOutput,
  buildSchema as organizationSchema,
} from "@/configuration/organization";
import { buildSchema as personSchema } from "@/configuration/person";
import { stripHtmlTags } from "@/lib/html";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../../PageLoading";
import type { ClassDetail, PageContentProps } from "./page.types";

const templateType = getTemplateType("classes/[classSlug]");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(
            `@/templates/${CoreConfig.template}/classes/[classSlug]/page.content`
          ),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/classes/[classSlug]/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const dynamicParams = false;

export function generateStaticParams() {
  const classOrgs = OrganizationsConfig.organizations.filter(
    (org) => org.type === "Class",
  );
  const slugs = classOrgs.flatMap((x) => x.slugs).map((x) => x.slug);

  return [
    ...slugs.map((slug) => ({ classSlug: slug })),
    { classSlug: "__404__" },
  ];
}

const emptyOrganization: OrganizationOutput = { summary: "", people: [] };

function findClass(classSlug: string) {
  const metadata = OrganizationsConfig.organizations.find(
    (org) =>
      org.type === "Class" &&
      org.slugs.findIndex((x) => x.slug === classSlug) !== -1,
  );
  if (!metadata) {
    return null;
  }

  let details: OrganizationOutput;
  try {
    details = organizationSchema.parse(
      readConfigurationFromFile(join("organizations", `${metadata.id}.json`)),
    ) as OrganizationOutput;
  } catch {
    details = emptyOrganization;
  }

  const peopleWithDetails = details.people.map((personEntry) => {
    const personMeta = PeopleConfig.people.find((p) => p.id === personEntry.id);
    let personDetail = {};
    try {
      personDetail = personSchema.parse(
        readConfigurationFromFile(join("people", `${personEntry.id}.json`)),
      );
    } catch {
      // Person detail file not found, use defaults
    }
    return {
      ...personEntry,
      ...(personMeta || {}),
      ...personDetail,
    };
  });

  return {
    ...metadata,
    ...details,
    people: peopleWithDetails,
  } as ClassDetail;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ classSlug: string }>;
}) {
  const { classSlug } = await params;
  const classItem = findClass(classSlug);
  if (!classItem) {
    return {};
  }

  return createPageMetadata({
    title: classItem.name,
    description: stripHtmlTags(classItem.summary || "").slice(0, 300),
    path: `/classes/${classSlug}/`,
    image: classItem.logo || CoreConfig.logo || CoreConfig.logoIcon,
  });
}

async function Page({ params }: { params: Promise<{ classSlug: string }> }) {
  const { classSlug } = await params;
  if (!PageContent) {
    notFound();
  }
  const classItem = findClass(classSlug);
  if (!classItem) {
    notFound();
  }

  const canonical = getCanonicalUrl(`/classes/${classSlug}/`);
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent classItem={classItem} schoolName={CoreConfig.schoolName} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: classItem.name,
          description: stripHtmlTags(classItem.summary || "").slice(0, 300),
          ...(classItem.logo ? { logo: classItem.logo } : {}),
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
