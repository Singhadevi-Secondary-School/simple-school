import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Download,
  FileText,
  Mail,
  Paperclip,
  Phone,
} from "lucide-react";
import type { ReactNode } from "react";
import SmartLink from "@/components/ui/SmartLink";
import type { TOutput as DownloadsOutput } from "@/configuration/downloads";
import styles from "@/templates/default/shared.module.css";

type AttachmentEntry = DownloadsOutput["downloads"][number];

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PersonCardData {
  id?: string;
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  schedules?: Array<{
    weekday: string;
    from: string;
    to: string;
    description?: string;
  }>;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  variant,
}: {
  title: string;
  description?: ReactNode;
  breadcrumbs: BreadcrumbItem[];
  variant?: "card";
}) {
  return (
    <header
      className={
        styles.pageHeader +
        (variant === "card" ? ` ${styles.pageHeaderCard}` : "")
      }
    >
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <SmartLink href="/">Home</SmartLink>
        {breadcrumbs.map((item) => (
          <span
            className={styles.breadcrumbItem}
            key={`${item.label}-${item.href || "current"}`}
          >
            <span aria-hidden="true">/</span>
            {item.href ? (
              <SmartLink href={item.href}>{item.label}</SmartLink>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
      <h1 className={styles.pageTitle}>{title}</h1>
      {typeof description === "string" ? (
        description && <p className={styles.pageDescription}>{description}</p>
      ) : (
        description
      )}
    </header>
  );
}

export function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {href && linkLabel && (
        <SmartLink href={href} className={styles.sectionLink}>
          {linkLabel}
          <ArrowRight size={18} aria-hidden="true" />
        </SmartLink>
      )}
    </div>
  );
}

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <SmartLink href={href} className={styles.backLink}>
      <ArrowLeft size={18} aria-hidden="true" />
      {children}
    </SmartLink>
  );
}

export function ActionCard({
  title,
  summary,
  href,
  date,
  category,
  attachmentCount,
  coverImage,
  actionLabel = "View details",
  headingLevel = 2,
}: {
  title: string;
  summary?: string;
  href: string;
  date?: string;
  category?: string;
  attachmentCount?: number;
  coverImage?: string;
  actionLabel?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <article className={styles.cardAction}>
      {coverImage && (
        <img src={coverImage} alt="" className={styles.cardCover} />
      )}
      <div className={styles.cardActionHeader}>
        {(date || attachmentCount) && (
          <div className={styles.cardActionMeta}>
            {date && (
              <time className={styles.cardActionDate} dateTime={date}>
                {formatDate(date)}
              </time>
            )}
            {!!attachmentCount && (
              <span className={styles.cardActionBadge}>
                <Paperclip size={14} aria-hidden="true" />
                {attachmentCount} file{attachmentCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
        )}
        <Heading className={styles.cardActionTitle}>{title}</Heading>
        {summary && <p className={styles.cardActionDescription}>{summary}</p>}
      </div>
      <footer className={styles.cardActionFooter}>
        {category && (
          <span className={styles.cardActionCategory}>{category}</span>
        )}
        <SmartLink href={href} className={styles.cardActionLink}>
          {actionLabel}
          <ArrowRight size={18} aria-hidden="true" />
        </SmartLink>
      </footer>
    </article>
  );
}

export function OrganizationCard({
  name,
  href,
  logo,
}: {
  name: string;
  href: string;
  logo?: string;
}) {
  return (
    <SmartLink href={href} className={styles.organizationCard}>
      {logo ? (
        <img className={styles.organizationLogo} src={logo} alt="" />
      ) : (
        <span className={styles.organizationMark} aria-hidden="true">
          <Building2 size={22} />
        </span>
      )}
      <span className={styles.organizationName}>{name}</span>
      <ArrowRight
        className={styles.cardInteractiveArrow}
        size={20}
        aria-hidden="true"
      />
    </SmartLink>
  );
}

export function PeopleGrid({
  people,
  label = "Members",
  showCount = true,
}: {
  people: PersonCardData[];
  label?: string;
  showCount?: boolean;
}) {
  return (
    <section className={styles.peopleSection} aria-label={label}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{label}</h2>
        {showCount && (
          <span className={styles.peopleCount}>
            {people.length} {people.length === 1 ? "member" : "members"}
          </span>
        )}
      </div>
      {people.length === 0 ? (
        <p className={styles.emptyState}>No people have been added yet.</p>
      ) : (
        <div className={styles.peopleList}>
          {people.map((person, index) => {
            const name = person.name?.trim() || "Team member";
            const schedule = person.schedules?.[0];
            const scheduleText = schedule
              ? schedule.description ||
                `${schedule.weekday}: ${schedule.from}–${schedule.to}`
              : undefined;

            return (
              <article
                key={person.id || `${name}-${index}`}
                className={styles.peopleItem}
              >
                <span className={styles.personAvatar} aria-hidden="true">
                  {name.charAt(0).toUpperCase()}
                </span>
                <div className={styles.personHeader}>
                  <h3 className={styles.peopleItemName}>{name}</h3>
                  {person.position && (
                    <p className={styles.peopleItemPosition}>
                      {person.position}
                    </p>
                  )}
                </div>
                {(person.email || person.phone || scheduleText) && (
                  <div className={styles.personContact}>
                    {person.email ? (
                      <SmartLink href={`mailto:${person.email}`} target="_self">
                        <Mail size={15} aria-hidden="true" />
                        <span>{person.email}</span>
                      </SmartLink>
                    ) : person.phone ? (
                      <SmartLink href={`tel:${person.phone}`} target="_self">
                        <Phone size={15} aria-hidden="true" />
                        <span>{person.phone}</span>
                      </SmartLink>
                    ) : scheduleText ? (
                      <span>
                        <FileText size={15} aria-hidden="true" />
                        <span>{scheduleText}</span>
                      </span>
                    ) : null}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function getFileName(url: string) {
  return url.split(/[?#]/)[0]?.split("/").filter(Boolean).pop() || "";
}

export function getFileType(url: string) {
  const fileName = getFileName(url);
  const extension = fileName.split(".").pop();
  return extension && extension !== fileName ? extension.toUpperCase() : "File";
}

export function AttachmentList({
  attachments,
  title = "Attachments & related resources",
}: {
  attachments: Array<AttachmentEntry | string>;
  title?: string;
}) {
  if (attachments.length === 0) return null;

  return (
    <section className={styles.attachmentSection} aria-label="Attachments">
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.attachmentList}>
        {attachments.map((attachment, index) => {
          const file =
            typeof attachment === "string"
              ? {
                  name: getFileName(attachment) || `Attached file ${index + 1}`,
                  url: attachment,
                }
              : attachment;

          return (
            <div className={styles.attachmentItem} key={file.url || index}>
              <div className={styles.attachmentInfo}>
                <FileText
                  className={styles.attachmentIcon}
                  size={22}
                  aria-hidden="true"
                />
                <div className={styles.attachmentDetails}>
                  <span className={styles.attachmentName}>{file.name}</span>
                  <span className={styles.attachmentType}>
                    {getFileType(file.url)}
                  </span>
                </div>
              </div>
              <SmartLink
                href={file.url}
                className={styles.btnPrimary}
                download
                target="_self"
              >
                <Download size={18} aria-hidden="true" />
                Download
              </SmartLink>
            </div>
          );
        })}
      </div>
    </section>
  );
}
