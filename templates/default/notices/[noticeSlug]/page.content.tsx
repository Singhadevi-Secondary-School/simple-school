import type { PageContentProps } from "@/app/(app)/notices/[noticeSlug]/page.types";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import {
  AttachmentList,
  BackLink,
  formatDate,
} from "@/templates/default/components";
import AssociatedOrganizations from "@/templates/default/organization-links";
import styles from "@/templates/default/shared.module.css";

function PageContent({ notice }: PageContentProps) {
  return (
    <section className={styles.container} aria-label={notice.title}>
      <BackLink href="/notices/">Back to notices</BackLink>

      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <time className={styles.articleMetaText} dateTime={notice.date}>
              Published {formatDate(notice.date)}
            </time>
            {notice.category && (
              <>
                <span className={styles.articleMetaDivider} aria-hidden="true">
                  ·
                </span>
                <span className={styles.articleTag}>{notice.category}</span>
              </>
            )}
            {notice.author && (
              <>
                <span className={styles.articleMetaDivider} aria-hidden="true">
                  ·
                </span>
                <span className={styles.articleMetaText}>
                  Written by {notice.author}
                </span>
              </>
            )}
          </div>
          <h1 className={styles.articleTitle}>{notice.title}</h1>
        </header>

        <div className={styles.articleBody}>
          {notice.summary && <p>{notice.summary}</p>}
          <HtmlRenderer>{notice.content}</HtmlRenderer>
        </div>

        <AttachmentList attachments={notice.attachments} />
        <AssociatedOrganizations ids={notice.associatedOrganisationIds} />
      </article>
    </section>
  );
}

export default PageContent;
