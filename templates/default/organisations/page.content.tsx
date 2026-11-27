import type { PageContentProps } from "@/app/(app)/organisations/page.types";
import { getActiveSlug } from "@/lib/slugs";
import { OrganizationCard, PageHeader } from "@/templates/default/components";
import shared from "@/templates/default/shared.module.css";

function PageContent({ organisationsConfig, coreConfig }: PageContentProps) {
  const others = organisationsConfig.organizations.filter(
    (org) => org.type === "Others",
  );

  return (
    <section className={shared.container} aria-label="Organisations">
      <PageHeader
        title="Organisations"
        description={`Explore organisations within ${coreConfig.schoolName}.`}
        breadcrumbs={[{ label: "Organisations" }]}
      />

      {others.length === 0 ? (
        <p className={shared.emptyState}>No organisations available yet.</p>
      ) : (
        <div className={shared.organizationGrid}>
          {others.map((org) => (
            <OrganizationCard
              key={org.id}
              name={org.name}
              logo={org.logo}
              href={`/organisations/${getActiveSlug(org.slugs)}/`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PageContent;
