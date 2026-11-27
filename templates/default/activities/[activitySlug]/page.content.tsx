import type { PageContentProps } from "@/app/(app)/activities/[activitySlug]/page.types";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import { BackLink, formatDate } from "@/templates/default/components";
import AssociatedOrganizations from "@/templates/default/organization-links";
import styles from "@/templates/default/shared.module.css";

function PageContent({ activity }: PageContentProps) {
  return (
    <section className={styles.container} aria-label={activity.title}>
      <BackLink href="/activities/">Back to activities</BackLink>

      <article className={styles.article}>
        {activity.coverImage && (
          <img
            src={activity.coverImage}
            alt=""
            className={styles.detailCover}
          />
        )}
        <header className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <time className={styles.articleMetaText} dateTime={activity.date}>
              Held {formatDate(activity.date)}
            </time>
            {activity.category && (
              <>
                <span className={styles.articleMetaDivider} aria-hidden="true">
                  ·
                </span>
                <span className={styles.articleTag}>{activity.category}</span>
              </>
            )}
            {activity.author && (
              <>
                <span className={styles.articleMetaDivider} aria-hidden="true">
                  ·
                </span>
                <span className={styles.articleMetaText}>
                  Written by {activity.author}
                </span>
              </>
            )}
          </div>
          <h1 className={styles.articleTitle}>{activity.title}</h1>
        </header>

        <div className={styles.articleBody}>
          {activity.summary && <p>{activity.summary}</p>}
          <HtmlRenderer>{activity.content}</HtmlRenderer>
        </div>

        <AssociatedOrganizations ids={activity.associatedOrganisationIds} />
      </article>
    </section>
  );
}

export default PageContent;
