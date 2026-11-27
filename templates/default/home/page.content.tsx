import type { PageContentProps } from "@/app/(app)/page.types";
import SmartLink from "@/components/ui/SmartLink";
import { ContentsConfig } from "@/configuration";
import { getActiveSlug } from "@/lib/slugs";
import { CampusIllustration } from "@/templates/default/campus-illustration";
import {
  ActionCard,
  formatDate,
  SectionHeader,
} from "@/templates/default/components";
import styles from "@/templates/default/shared.module.css";

function PageContent({ coreConfig, homeConfig }: PageContentProps) {
  const notices = ContentsConfig.list
    .filter((item) => item.type === "notice")
    .slice(0, homeConfig.latestNoticesCount ?? 3);
  const publications = ContentsConfig.list
    .filter((item) => item.type === "publication")
    .slice(0, homeConfig.recentPublicationsCount ?? 5);

  return (
    <>
      <section className={styles.heroSection} aria-label="Welcome">
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>{homeConfig.heroTitle || ""}</h1>
              {homeConfig.heroDescription && (
                <p className={styles.heroDescription}>
                  {homeConfig.heroDescription}
                </p>
              )}
            </div>
            <div className={styles.heroActions}>
              <SmartLink href="/about/" className={styles.btnPrimary}>
                About us
              </SmartLink>
              <SmartLink href="/results/" className={styles.btnSecondary}>
                View results
              </SmartLink>
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            {homeConfig.heroPicture ? (
              <img
                src={homeConfig.heroPicture}
                alt={`${coreConfig.schoolName}`}
                className={styles.heroImage}
              />
            ) : (
              <CampusIllustration
                className={styles.heroImage}
                label="People on a campus"
                titleId="campus-illustration-title"
              />
            )}
          </div>
        </div>
      </section>

      <section className={styles.container} aria-label="Latest updates">
        <div className={styles.twoColumn}>
          <div className={styles.homeColumn}>
            <SectionHeader
              title="Latest notices"
              href="/notices/"
              linkLabel="All notices"
            />
            <div className={styles.homeCardList}>
              {notices.map((notice) => (
                <ActionCard
                  key={notice.id}
                  title={notice.title}
                  summary={notice.summary}
                  href={`/notices/${getActiveSlug(notice.slugs)}/`}
                  date={notice.date}
                  category={notice.category}
                  attachmentCount={notice.attachments.length}
                  headingLevel={3}
                />
              ))}
              {notices.length === 0 && (
                <p className={styles.emptyState}>No notices yet.</p>
              )}
            </div>
          </div>

          <div className={styles.homeColumn}>
            <SectionHeader
              title="Recent publications"
              href="/publications/"
              linkLabel="All publications"
            />
            <div className={styles.publicationList}>
              {publications.map((publication) => (
                <SmartLink
                  key={publication.id}
                  href={`/publications/${getActiveSlug(publication.slugs)}/`}
                  className={styles.cardInteractive}
                >
                  <div className={styles.cardInteractiveContent}>
                    <span className={styles.cardInteractiveMeta}>
                      {formatDate(publication.date)}
                      {publication.author ? ` · ${publication.author}` : ""}
                    </span>
                    <h3 className={styles.cardInteractiveTitle}>
                      {publication.title}
                    </h3>
                  </div>
                  <span
                    className={styles.cardInteractiveArrow}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </SmartLink>
              ))}
              {publications.length === 0 && (
                <p className={styles.emptyState}>No publications yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PageContent;
