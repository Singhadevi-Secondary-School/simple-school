import type { PageContentProps } from "@/app/(app)/faculties/page.types";
import { getActiveSlug } from "@/lib/slugs";
import { OrganizationCard, PageHeader } from "@/templates/default/components";
import shared from "@/templates/default/shared.module.css";

function PageContent({ facultiesConfig }: PageContentProps) {
  const faculties = facultiesConfig.organizations.filter(
    (org) => org.type === "Faculty",
  );

  return (
    <section className={shared.container} aria-label="Faculties">
      <PageHeader
        title="Faculties"
        description="Explore faculties and academic departments."
        breadcrumbs={[{ label: "Faculties" }]}
      />

      {faculties.length === 0 ? (
        <p className={shared.emptyState}>No faculties available yet.</p>
      ) : (
        <div className={shared.organizationGrid}>
          {faculties.map((faculty) => (
            <OrganizationCard
              key={faculty.id}
              name={faculty.name}
              logo={faculty.logo}
              href={`/faculties/${getActiveSlug(faculty.slugs)}/`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PageContent;
