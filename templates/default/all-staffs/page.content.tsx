import type { PageContentProps } from "@/app/(app)/all-staffs/page.types";
import { PageHeader, PeopleGrid } from "@/templates/default/components";
import shared from "@/templates/default/shared.module.css";

function PageContent({ staff, schoolName }: PageContentProps) {
  return (
    <section className={shared.container} aria-label="Staff directory">
      <PageHeader
        title="Staff directory"
        description={`Meet the people at ${schoolName}.`}
        breadcrumbs={[{ label: "Staff" }]}
      />

      {staff.length === 0 ? (
        <p className={shared.emptyState}>No staff listed yet.</p>
      ) : (
        <PeopleGrid people={staff} label="Staff members" />
      )}
    </section>
  );
}

export default PageContent;
