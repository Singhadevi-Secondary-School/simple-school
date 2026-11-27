import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import type { PageContentProps } from "@/app/(app)/grievance/page.types";
import SmartLink from "@/components/ui/SmartLink";
import { PageHeader } from "@/templates/default/components";
import styles from "@/templates/default/shared.module.css";

function PageContent({ grievanceConfig }: PageContentProps) {
  const name = grievanceConfig.contactName || "Institution contact";

  return (
    <section className={styles.container} aria-label="Contact information">
      <PageHeader
        title="Contact & feedback"
        description="Contact the right person with questions, concerns, or feedback."
        breadcrumbs={[{ label: "Contact & feedback" }]}
      />

      <article className={`${styles.contactCard} ${styles.contactCardInner}`}>
        {grievanceConfig.contactImage ? (
          <img
            src={grievanceConfig.contactImage}
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
          {grievanceConfig.contactSummary && (
            <p className={styles.contactSummary}>
              {grievanceConfig.contactSummary}
            </p>
          )}
        </div>

        <div className={styles.contactMethods}>
          {grievanceConfig.contactPhone && (
            <div className={styles.contactMethod}>
              <span className={styles.contactMethodLabel}>
                <Phone size={18} aria-hidden="true" /> Phone
              </span>
              <SmartLink
                href={`tel:${grievanceConfig.contactPhone}`}
                target="_self"
              >
                {grievanceConfig.contactPhone}
              </SmartLink>
            </div>
          )}
          {grievanceConfig.contactEmail && (
            <div className={styles.contactMethod}>
              <span className={styles.contactMethodLabel}>
                <Mail size={18} aria-hidden="true" /> Email
              </span>
              <SmartLink
                href={`mailto:${grievanceConfig.contactEmail}`}
                target="_self"
              >
                {grievanceConfig.contactEmail}
              </SmartLink>
            </div>
          )}
          {grievanceConfig.contactHour && (
            <div className={styles.contactMethod}>
              <span className={styles.contactMethodLabel}>
                <Clock3 size={18} aria-hidden="true" /> Office hours
              </span>
              <span>{grievanceConfig.contactHour}</span>
            </div>
          )}
          {grievanceConfig.contactAddress && (
            <div className={styles.contactMethod}>
              <span className={styles.contactMethodLabel}>
                <MapPin size={18} aria-hidden="true" /> Address
              </span>
              <address>{grievanceConfig.contactAddress}</address>
            </div>
          )}
          {!grievanceConfig.contactPhone &&
            !grievanceConfig.contactEmail &&
            !grievanceConfig.contactHour &&
            !grievanceConfig.contactAddress && (
              <p className={styles.emptyState}>
                No contact details are available yet.
              </p>
            )}
        </div>
      </article>
    </section>
  );
}

export default PageContent;
