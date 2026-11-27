import type { PageContentProps } from "@/app/(app)/notices/page.types";
import { getActiveSlug } from "@/lib/slugs";
import { ActionCard, PageHeader } from "@/templates/default/components";
import styles from "@/templates/default/shared.module.css";

function PageContent({ noticesConfig }: PageContentProps) {
  return (
    <section className={styles.container} aria-label="Notices">
      <PageHeader
        title="Notices"
        description="Browse announcements and important updates."
        breadcrumbs={[{ label: "Notices" }]}
      />

      {noticesConfig.length === 0 ? (
        <p className={styles.emptyState}>No notices yet.</p>
      ) : (
        <div className={styles.grid3}>
          {noticesConfig.map((notice) => (
            <ActionCard
              key={notice.id}
              title={notice.title}
              summary={notice.summary}
              href={`/notices/${getActiveSlug(notice.slugs)}/`}
              date={notice.date}
              category={notice.category}
              attachmentCount={notice.attachments.length}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PageContent;
