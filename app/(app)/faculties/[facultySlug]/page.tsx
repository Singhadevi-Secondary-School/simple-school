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
import type { FacultyDetail, PageContentProps } from "./page.types";

const templateType = getTemplateType("faculties/[facultySlug]");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(
            `@/templates/${CoreConfig.template}/faculties/[facultySlug]/page.content`
          ),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/faculties/[facultySlug]/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const dynamicParams = false;

export function generateStaticParams() {
  const facultyOrgs = OrganizationsConfig.organizations.filter(
    (org) => org.type === "Faculty",
  );
  const slugs = facultyOrgs.flatMap((x) => x.slugs).map((x) => x.slug);

  return [
    ...slugs.map((slug) => ({ facultySlug: slug })),
    { facultySlug: "__404__" },
  ];
}

const emptyOrganization: OrganizationOutput = { summary: "", people: [] };

function findFaculty(facultySlug: string) {
  const metadata = OrganizationsConfig.organizations.find(
    (org) =>
      org.type === "Faculty" &&
      org.slugs.findIndex((x) => x.slug === facultySlug) !== -1,
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
  } as FacultyDetail;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ facultySlug: string }>;
}) {
  const { facultySlug } = await params;
  const faculty = findFaculty(facultySlug);
  if (!faculty) {
    return {};
  }

  return createPageMetadata({
    title: faculty.name,
    description: stripHtmlTags(faculty.summary || "").slice(0, 300),
    path: `/faculties/${facultySlug}/`,
    image: faculty.logo || CoreConfig.logo || CoreConfig.logoIcon,
  });
}

async function Page({ params }: { params: Promise<{ facultySlug: string }> }) {
  const { facultySlug } = await params;
  if (!PageContent) {
    notFound();
  }
  const faculty = findFaculty(facultySlug);
  if (!faculty) {
    notFound();
  }

  const canonical = getCanonicalUrl(`/faculties/${facultySlug}/`);
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent faculty={faculty} schoolName={CoreConfig.schoolName} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: faculty.name,
          description: stripHtmlTags(faculty.summary || "").slice(0, 300),
          ...(faculty.logo ? { logo: faculty.logo } : {}),
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
