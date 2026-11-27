import type { PageContentProps } from "@/app/(app)/classes/[classSlug]/page.types";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import { PageHeader, PeopleGrid } from "@/templates/default/components";
import OrganizationContent from "@/templates/default/organization-content";
import styles from "@/templates/default/shared.module.css";

function PageContent({ classItem }: PageContentProps) {
  return (
    <section className={styles.container} aria-label={classItem.name}>
      <PageHeader
        title={classItem.name}
        description={
          classItem.summary ? (
            <HtmlRenderer className={styles.pageDescription}>
              {classItem.summary}
            </HtmlRenderer>
          ) : undefined
        }
        breadcrumbs={[
          { label: "Classes", href: "/classes/" },
          { label: classItem.name },
        ]}
        variant="card"
      />

      <PeopleGrid
        people={classItem.people}
        label="Assigned teachers, advisors, and students"
        showCount={false}
      />

      <OrganizationContent organizationId={classItem.id} />
    </section>
  );
}

export default PageContent;
