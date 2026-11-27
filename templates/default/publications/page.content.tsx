import type { PageContentProps } from "@/app/(app)/publications/page.types";
import { getActiveSlug } from "@/lib/slugs";
import { ActionCard, PageHeader } from "@/templates/default/components";
import styles from "@/templates/default/shared.module.css";

function PageContent({ publicationsConfig }: PageContentProps) {
  return (
    <section className={styles.container} aria-label="Publications">
      <PageHeader
        title="Publications"
        description="Browse journals, newsletters, and other publications."
        breadcrumbs={[{ label: "Publications" }]}
      />

      {publicationsConfig.length === 0 ? (
        <p className={styles.emptyState}>No publications yet.</p>
      ) : (
        <div className={styles.grid3}>
          {publicationsConfig.map((publication) => (
            <ActionCard
              key={publication.id}
              title={publication.title}
              summary={publication.summary}
              href={`/publications/${getActiveSlug(publication.slugs)}/`}
              date={publication.date}
              category={publication.category}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PageContent;
