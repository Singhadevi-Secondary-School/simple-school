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
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../PageLoading";
import type { PageContentProps } from "./page.types";

const templateType = getTemplateType("all-staffs");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(`@/templates/${CoreConfig.template}/all-staffs/page.content`),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/all-staffs/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

const emptyOrganization: OrganizationOutput = { summary: "", people: [] };

function findSchoolStaff() {
  const schoolOrg = OrganizationsConfig.organizations.find(
    (org) => org.type === "School",
  );
  if (!schoolOrg) {
    return [];
  }

  let details: OrganizationOutput;
  try {
    details = organizationSchema.parse(
      readConfigurationFromFile(join("organizations", `${schoolOrg.id}.json`)),
    ) as OrganizationOutput;
  } catch {
    details = emptyOrganization;
  }

  return details.people.map((personEntry) => {
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
}

export const metadata = createPageMetadata({
  title: "All Staff",
  description: `${CoreConfig.schoolName} staff and faculty members.`,
  path: "/all-staffs/",
  image: CoreConfig.logo || CoreConfig.logoIcon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const staff = findSchoolStaff();
  const canonical = getCanonicalUrl("/all-staffs/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent staff={staff} schoolName={CoreConfig.schoolName} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: `${CoreConfig.schoolName} - All Staff`,
          description: `${CoreConfig.schoolName} staff and faculty members.`,
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
