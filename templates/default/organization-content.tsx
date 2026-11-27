import { ContentsConfig } from "@/configuration";
import { getActiveSlug } from "@/lib/slugs";
import { ActionCard, SectionHeader } from "@/templates/default/components";
import styles from "@/templates/default/shared.module.css";

const sections = [
  {
    type: "activity",
    title: "Recent activities",
    href: "/activities/",
    linkLabel: "All activities",
    emptyMessage: "No recent activities yet.",
  },
  {
    type: "notice",
    title: "Recent notices",
    href: "/notices/",
    linkLabel: "All notices",
    emptyMessage: "No recent notices yet.",
  },
  {
    type: "publication",
    title: "Recent publications",
    href: "/publications/",
    linkLabel: "All publications",
    emptyMessage: "No recent publications yet.",
  },
] as const;

const contentRoutes = {
  activity: "activities",
  notice: "notices",
  publication: "publications",
};

export default function OrganizationContent({
  organizationId,
}: {
  organizationId: string;
}) {
  return (
    <>
      {sections.map((section) => {
        const content = ContentsConfig.list
          .filter(
            (item) =>
              item.type === section.type &&
              item.associatedOrganisationIds.includes(organizationId),
          )
          .sort((left, right) => right.date.localeCompare(left.date))
          .slice(0, 3);

        return (
          <section
            key={section.type}
            className={styles.homeColumn}
            aria-label={section.title}
          >
            <SectionHeader
              title={section.title}
              href={section.href}
              linkLabel={section.linkLabel}
            />
            {content.length === 0 ? (
              <p className={styles.emptyState}>{section.emptyMessage}</p>
            ) : (
              <div className={styles.grid3}>
                {content.map((item) => (
                  <ActionCard
                    key={item.id}
                    title={item.title}
                    summary={item.summary}
                    href={`/${contentRoutes[item.type]}/${getActiveSlug(item.slugs)}/`}
                    date={item.date}
                    category={item.category}
                    attachmentCount={
                      item.type === "notice"
                        ? item.attachments.length
                        : undefined
                    }
                    coverImage={
                      item.type === "notice" ? undefined : item.coverImage
                    }
                    headingLevel={3}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
