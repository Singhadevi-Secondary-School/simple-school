import type { PageContentProps } from "@/app/(app)/activities/page.types";
import { getActiveSlug } from "@/lib/slugs";
import { ActionCard, PageHeader } from "@/templates/default/components";
import styles from "@/templates/default/shared.module.css";

function PageContent({ activitiesConfig }: PageContentProps) {
  return (
    <section className={styles.container} aria-label="Activities">
      <PageHeader
        title="Activities"
        description="Explore events, programs, and other activities."
        breadcrumbs={[{ label: "Activities" }]}
      />

      {activitiesConfig.length === 0 ? (
        <p className={styles.emptyState}>No activities yet.</p>
      ) : (
        <div className={styles.grid3}>
          {activitiesConfig.map((activity) => (
            <ActionCard
              key={activity.id}
              title={activity.title}
              summary={activity.summary}
              href={`/activities/${getActiveSlug(activity.slugs)}/`}
              date={activity.date}
              category={activity.category}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PageContent;
