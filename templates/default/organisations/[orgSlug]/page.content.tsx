import type { PageContentProps } from "@/app/(app)/organisations/[orgSlug]/page.types";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import { PageHeader, PeopleGrid } from "@/templates/default/components";
import OrganizationContent from "@/templates/default/organization-content";
import styles from "@/templates/default/shared.module.css";

function PageContent({ organization }: PageContentProps) {
  return (
    <section className={styles.container} aria-label={organization.name}>
      <PageHeader
        title={organization.name}
        description={
          organization.summary ? (
            <HtmlRenderer className={styles.pageDescription}>
              {organization.summary}
            </HtmlRenderer>
          ) : undefined
        }
        breadcrumbs={[
          { label: "Organisations", href: "/organisations/" },
          { label: organization.name },
        ]}
        variant="card"
      />

      {organization.people.length > 0 && (
        <PeopleGrid people={organization.people} label="Members" />
      )}

      <OrganizationContent organizationId={organization.id} />
    </section>
  );
}

export default PageContent;
