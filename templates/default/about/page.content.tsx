import type { PageContentProps } from "@/app/(app)/about/page.types";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import { cn } from "@/lib/utils";
import { CampusIllustration } from "@/templates/default/campus-illustration";
import { PageHeader } from "@/templates/default/components";
import styles from "@/templates/default/shared.module.css";

function PageContent({
  coreConfig,
  aboutConfig,
  navigationConfig,
}: PageContentProps) {
  return (
    <section className={styles.container} aria-label="About the institution">
      <PageHeader
        title="About us"
        description="Learn about the institution, its values, and its approach."
        breadcrumbs={[{ label: "About" }]}
      />

      <section className={styles.aboutGrid} aria-label="Institution profile">
        {aboutConfig.introPicture ? (
          <img
            src={aboutConfig.introPicture}
            alt={`${coreConfig.schoolName} campus`}
            className={styles.profileImage}
          />
        ) : (
          <CampusIllustration
            className={styles.profileImage}
            label={`${coreConfig.schoolName} campus`}
            titleId="campus-illustration-title"
          />
        )}

        <article className={styles.keyInfoCard}>
          <header className={styles.keyInfoHeading}>
            <h2 className={styles.sectionTitle}>Key information</h2>
            <p>Key details about the institution.</p>
          </header>
          <dl className={styles.keyInfoList}>
            <div className={styles.keyInfoRow}>
              <dt>Institution name</dt>
              <dd>{coreConfig.schoolName}</dd>
            </div>
            {coreConfig.location && (
              <div className={styles.keyInfoRow}>
                <dt>Location</dt>
                <dd>{coreConfig.location}</dd>
              </div>
            )}
            {aboutConfig.keypoints.map((point) => (
              <div
                className={styles.keyInfoRow}
                key={`${point.title}-${point.value}`}
              >
                <dt>{point.title}</dt>
                <dd>{point.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </section>

      {aboutConfig.story && (
        <section className={styles.storyCard} aria-label="Our story">
          <h2 className={styles.sectionTitle}>Our story</h2>
          <HtmlRenderer className={cn(styles.storyText, "max-w-full!")}>
            {aboutConfig.story}
          </HtmlRenderer>
        </section>
      )}

      {navigationConfig.socials.length > 0 && (
        <nav className={styles.socialLinks} aria-label="Social media links">
          <ul className={styles.socialLinksList}>
            {navigationConfig.socials.map((social, index) => (
              <li
                className={styles.socialLinkItem}
                key={`${social.name}-${social.url}`}
              >
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  {social.name}
                </a>
                {index < navigationConfig.socials.length - 1 && (
                  <span className={styles.socialSeparator} aria-hidden="true">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}

export default PageContent;
