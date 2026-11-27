import type { PageContentProps } from "@/app/(app)/classes/page.types";
import { getActiveSlug } from "@/lib/slugs";
import { OrganizationCard, PageHeader } from "@/templates/default/components";
import shared from "@/templates/default/shared.module.css";

function PageContent({ classesConfig }: PageContentProps) {
  const classes = classesConfig.organizations.filter(
    (org) => org.type === "Class",
  );

  return (
    <section className={shared.container} aria-label="Classes">
      <PageHeader
        title="Classes"
        description="Browse classes and their details."
        breadcrumbs={[{ label: "Classes" }]}
      />

      {classes.length === 0 ? (
        <p className={shared.emptyState}>No classes available yet.</p>
      ) : (
        <div className={shared.organizationGrid}>
          {classes.map((cls) => (
            <OrganizationCard
              key={cls.id}
              name={cls.name}
              logo={cls.logo}
              href={`/classes/${getActiveSlug(cls.slugs)}/`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PageContent;
