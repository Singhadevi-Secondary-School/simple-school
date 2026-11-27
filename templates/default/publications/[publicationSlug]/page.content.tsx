import type { PageContentProps } from "@/app/(app)/publications/[publicationSlug]/page.types";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import { BackLink, formatDate } from "@/templates/default/components";
import AssociatedOrganizations from "@/templates/default/organization-links";
import styles from "@/templates/default/shared.module.css";

function PageContent({ publication }: PageContentProps) {
  return (
    <section className={styles.container} aria-label={publication.title}>
      <BackLink href="/publications/">Back to publications</BackLink>

      <article className={styles.article}>
        {publication.coverImage && (
          <img
            src={publication.coverImage}
            alt=""
            className={styles.detailCover}
          />
        )}
        <header className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <time
              className={styles.articleMetaText}
              dateTime={publication.date}
            >
              Published {formatDate(publication.date)}
            </time>
            {publication.category && (
              <>
                <span className={styles.articleMetaDivider} aria-hidden="true">
                  ·
                </span>
                <span className={styles.articleTag}>
                  {publication.category}
                </span>
              </>
            )}
            {publication.author && (
              <>
                <span className={styles.articleMetaDivider} aria-hidden="true">
                  ·
                </span>
                <span className={styles.articleMetaText}>
                  Written by {publication.author}
                </span>
              </>
            )}
          </div>
          <h1 className={styles.articleTitle}>{publication.title}</h1>
        </header>

        <div className={styles.articleBody}>
          {publication.summary && <p>{publication.summary}</p>}
          <HtmlRenderer>{publication.content}</HtmlRenderer>
        </div>

        <AssociatedOrganizations ids={publication.associatedOrganisationIds} />
      </article>
    </section>
  );
}

export default PageContent;
