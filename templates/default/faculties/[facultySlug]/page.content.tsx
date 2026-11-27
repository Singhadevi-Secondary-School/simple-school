import type { PageContentProps } from "@/app/(app)/faculties/[facultySlug]/page.types";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import { PageHeader, PeopleGrid } from "@/templates/default/components";
import OrganizationContent from "@/templates/default/organization-content";
import styles from "@/templates/default/shared.module.css";

function PageContent({ faculty }: PageContentProps) {
  return (
    <section className={styles.container} aria-label={faculty.name}>
      <PageHeader
        title={faculty.name}
        description={
          faculty.summary ? (
            <HtmlRenderer className={styles.pageDescription}>
              {faculty.summary}
            </HtmlRenderer>
          ) : undefined
        }
        breadcrumbs={[
          { label: "Faculties", href: "/faculties/" },
          { label: faculty.name },
        ]}
        variant="card"
      />

      {faculty.people.length > 0 && (
        <PeopleGrid people={faculty.people} label="Faculty members" />
      )}

      <OrganizationContent organizationId={faculty.id} />
    </section>
  );
}

export default PageContent;
