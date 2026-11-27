import SmartLink from "@/components/ui/SmartLink";
import { OrganizationsConfig } from "@/configuration";
import { getActiveSlug } from "@/lib/slugs";
import styles from "@/templates/default/shared.module.css";

const badgeTones = ["blue", "cyan", "teal", "gold", "mist", "slate"] as const;

export default function AssociatedOrganizations({ ids }: { ids: string[] }) {
  const organizations = OrganizationsConfig.organizations.filter(
    (organization) => ids.includes(organization.id),
  );

  if (organizations.length === 0) return null;

  return (
    <section
      className={styles.associatedOrganizations}
      aria-label="Related groups"
    >
      <span>Related groups:</span>
      {organizations.map((organization, index) => {
        const route =
          organization.type === "Class"
            ? "classes"
            : organization.type === "Faculty"
              ? "faculties"
              : organization.type === "Others"
                ? "organisations"
                : undefined;
        const slug = getActiveSlug(organization.slugs);
        const tone = badgeTones[index % badgeTones.length];

        return route ? (
          <SmartLink
            key={organization.id}
            href={`/${route}/${slug}/`}
            className={styles.organizationBadge}
            data-tone={tone}
          >
            {organization.name}
          </SmartLink>
        ) : (
          <span
            key={organization.id}
            className={styles.organizationBadge}
            data-tone={tone}
          >
            {organization.name}
          </span>
        );
      })}
    </section>
  );
}
