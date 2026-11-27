import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import type { PageContentProps } from "@/app/(app)/contact/page.types";
import SmartLink from "@/components/ui/SmartLink";
import { PageHeader } from "@/templates/default/components";
import styles from "@/templates/default/shared.module.css";

function PageContent({ contactConfig, navigationConfig }: PageContentProps) {
  const name = contactConfig.contactName || "Institution contact";

  return (
    <section className={styles.container} aria-label="Contact information">
      <PageHeader
        title="Contact & Feedback"
        description="Contact the right person with questions, concerns, or feedback."
        breadcrumbs={[{ label: "Contact & Feedback" }]}
      />

      <article className={`${styles.contactCard} ${styles.contactCardInner}`}>
        {contactConfig.contactImage ? (
          <img
            src={contactConfig.contactImage}
            alt={`Portrait of ${name}`}
            className={styles.contactProfileImage}
          />
        ) : (
          <span className={styles.contactAvatar} aria-hidden="true">
            {name.trim().charAt(0).toUpperCase()}
          </span>
        )}

        <div className={styles.contactIntro}>
          <h2 className={styles.sectionTitle}>{name}</h2>
          {contactConfig.contactSummary && (
            <p className={styles.contactSummary}>
              {contactConfig.contactSummary}
            </p>
          )}
        </div>

        <div className={styles.contactMethods}>
          {contactConfig.contactPhone && (
            <div className={styles.contactMethod}>
              <span className={styles.contactMethodLabel}>
                <Phone size={18} aria-hidden="true" /> Phone
              </span>
              <SmartLink
                href={`tel:${contactConfig.contactPhone}`}
                target="_self"
              >
                {contactConfig.contactPhone}
              </SmartLink>
            </div>
          )}
          {contactConfig.contactEmail && (
            <div className={styles.contactMethod}>
              <span className={styles.contactMethodLabel}>
                <Mail size={18} aria-hidden="true" /> Email
              </span>
              <SmartLink
                href={`mailto:${contactConfig.contactEmail}`}
                target="_self"
              >
                {contactConfig.contactEmail}
              </SmartLink>
            </div>
          )}
          {contactConfig.contactHour && (
            <div className={styles.contactMethod}>
              <span className={styles.contactMethodLabel}>
                <Clock3 size={18} aria-hidden="true" /> Office hours
              </span>
              <span>{contactConfig.contactHour}</span>
            </div>
          )}
          {contactConfig.contactAddress && (
            <div className={styles.contactMethod}>
              <span className={styles.contactMethodLabel}>
                <MapPin size={18} aria-hidden="true" /> Address
              </span>
              <address>{contactConfig.contactAddress}</address>
            </div>
          )}
          {!contactConfig.contactPhone &&
            !contactConfig.contactEmail &&
            !contactConfig.contactHour &&
            !contactConfig.contactAddress && (
              <p className={styles.emptyState}>
                No contact details are available yet.
              </p>
            )}
        </div>
      </article>

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
