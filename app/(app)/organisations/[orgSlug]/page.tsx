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
import type { OrganizationDetail, PageContentProps } from "./page.types";

const templateType = getTemplateType("organisations/[orgSlug]");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(
            `@/templates/${CoreConfig.template}/organisations/[orgSlug]/page.content`
          ),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/organisations/[orgSlug]/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const dynamicParams = false;

export function generateStaticParams() {
  const otherOrgs = OrganizationsConfig.organizations.filter(
    (org) => org.type === "Others",
  );
  const slugs = otherOrgs.flatMap((x) => x.slugs).map((x) => x.slug);

  return [...slugs.map((slug) => ({ orgSlug: slug })), { orgSlug: "__404__" }];
}

const emptyOrganization: OrganizationOutput = { summary: "", people: [] };
function findOrganization(orgSlug: string) {
  const metadata = OrganizationsConfig.organizations.find(
    (org) =>
      org.type === "Others" &&
      org.slugs.findIndex((x) => x.slug === orgSlug) !== -1,
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
  } as OrganizationDetail;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const organization = findOrganization(orgSlug);
  if (!organization) {
    return {};
  }

  return createPageMetadata({
    title: organization.name,
    description: stripHtmlTags(organization.summary || "").slice(0, 300),
    path: `/organisations/${orgSlug}/`,
    image: organization.logo || CoreConfig.logo || CoreConfig.logoIcon,
  });
}

async function Page({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  if (!PageContent) {
    notFound();
  }
  const organization = findOrganization(orgSlug);
  if (!organization) {
    notFound();
  }

  const canonical = getCanonicalUrl(`/organisations/${orgSlug}/`);
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent
          organization={organization}
          schoolName={CoreConfig.schoolName}
        />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: organization.name,
          description: stripHtmlTags(organization.summary || "").slice(0, 300),
          ...(organization.logo ? { logo: organization.logo } : {}),
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
