import { NextResponse } from "next/server";
import {
  ContentsConfig,
  CoreConfig,
  NavigationConfig,
  OrganizationsConfig,
  ResultsConfig,
} from "@/configuration";
import { getCanonicalUrl } from "@/lib/pageMetadata";

export const dynamic = "force-static";

const MENU_PATH_MAP = [
  { menu: "home", path: "/" },
  { menu: "about", path: "/about/" },
  { menu: "notices", path: "/notices/" },
  { menu: "publications", path: "/publications/" },
  { menu: "activities", path: "/activities/" },
  { menu: "all-staffs", path: "/all-staffs/" },
  { menu: "faculties", path: "/faculties/" },
  { menu: "classes", path: "/classes/" },
  { menu: "organisations", path: "/organisations/" },
  { menu: "results", path: "/results/" },
  { menu: "downloads", path: "/downloads/" },
  { menu: "contact", path: "/contact/" },
];

function getSitemapSlug(slugs: { slug: string; isActive: boolean }[]) {
  return slugs.find((s) => s.isActive)?.slug || slugs[0]?.slug;
}

export function GET() {
  const lines: string[] = [];

  // Site header
  const siteName = CoreConfig.schoolName || "School Website";
  lines.push(`# ${siteName}`);

  if (CoreConfig.seoDescription) {
    lines.push("");
    lines.push(CoreConfig.seoDescription);
  }

  // Important pages
  lines.push("");
  lines.push("## Important Pages");
  lines.push("");

  for (const item of MENU_PATH_MAP) {
    if (NavigationConfig.enabledNavigations.includes(item.menu)) {
      const url = getCanonicalUrl(item.path);
      if (url) {
        const label =
          item.menu === "contact"
            ? "Contact & Feedback"
            : item.menu.charAt(0).toUpperCase() + item.menu.slice(1);
        lines.push(`- **${label}:** ${url}`);
      }
    }
  }

  // Notices
  if (
    NavigationConfig.enabledNavigations.includes("notices") &&
    ContentsConfig.list.length > 0
  ) {
    const notices = ContentsConfig.list.filter((c) => c.type === "notice");
    if (notices.length > 0) {
      lines.push("");
      lines.push("## Notices");
      lines.push("");
      for (const notice of notices) {
        const slug = getSitemapSlug(notice.slugs);
        const url = slug ? getCanonicalUrl(`/notices/${slug}/`) : undefined;
        if (url) {
          lines.push(`- **${notice.title}** (${notice.date})`);
          lines.push(`  ${url}`);
        }
      }
    }
  }

  // Publications
  if (
    NavigationConfig.enabledNavigations.includes("publications") &&
    ContentsConfig.list.length > 0
  ) {
    const publications = ContentsConfig.list.filter(
      (c) => c.type === "publication",
    );
    if (publications.length > 0) {
      lines.push("");
      lines.push("## Publications");
      lines.push("");
      for (const pub of publications) {
        const slug = getSitemapSlug(pub.slugs);
        const url = slug
          ? getCanonicalUrl(`/publications/${slug}/`)
          : undefined;
        if (url) {
          lines.push(`- **${pub.title}** (${pub.date})`);
          lines.push(`  ${url}`);
        }
      }
    }
  }

  // Activities
  if (
    NavigationConfig.enabledNavigations.includes("activities") &&
    ContentsConfig.list.length > 0
  ) {
    const activities = ContentsConfig.list.filter((c) => c.type === "activity");
    if (activities.length > 0) {
      lines.push("");
      lines.push("## Activities");
      lines.push("");
      for (const activity of activities) {
        const slug = getSitemapSlug(activity.slugs);
        const url = slug ? getCanonicalUrl(`/activities/${slug}/`) : undefined;
        if (url) {
          lines.push(`- **${activity.title}** (${activity.date})`);
          lines.push(`  ${url}`);
        }
      }
    }
  }

  // Faculties
  if (NavigationConfig.enabledNavigations.includes("faculties")) {
    const faculties = OrganizationsConfig.organizations.filter(
      (o) => o.type === "Faculty",
    );
    if (faculties.length > 0) {
      lines.push("");
      lines.push("## Faculties");
      lines.push("");
      for (const faculty of faculties) {
        const slug = getSitemapSlug(faculty.slugs);
        const url = slug ? getCanonicalUrl(`/faculties/${slug}/`) : undefined;
        if (url) {
          lines.push(`- **${faculty.name}** ${url}`);
        }
      }
    }
  }

  // Classes
  if (NavigationConfig.enabledNavigations.includes("classes")) {
    const classes = OrganizationsConfig.organizations.filter(
      (o) => o.type === "Class",
    );
    if (classes.length > 0) {
      lines.push("");
      lines.push("## Classes");
      lines.push("");
      for (const cls of classes) {
        const slug = getSitemapSlug(cls.slugs);
        const url = slug ? getCanonicalUrl(`/classes/${slug}/`) : undefined;
        if (url) {
          lines.push(`- **${cls.name}** ${url}`);
        }
      }
    }
  }

  // Organisations
  if (NavigationConfig.enabledNavigations.includes("organisations")) {
    const others = OrganizationsConfig.organizations.filter(
      (o) => o.type === "Others",
    );
    if (others.length > 0) {
      lines.push("");
      lines.push("## Organisations");
      lines.push("");
      for (const org of others) {
        const slug = getSitemapSlug(org.slugs);
        const url = slug
          ? getCanonicalUrl(`/organisations/${slug}/`)
          : undefined;
        if (url) {
          lines.push(`- **${org.name}** ${url}`);
        }
      }
    }
  }

  // Results
  if (
    NavigationConfig.enabledNavigations.includes("results") &&
    ResultsConfig.results.length > 0
  ) {
    lines.push("");
    lines.push("## Results");
    lines.push("");
    for (const result of ResultsConfig.results) {
      const slug = getSitemapSlug(result.slugs);
      const url = slug ? getCanonicalUrl(`/results/${slug}/`) : undefined;
      if (url) {
        lines.push(`- **${result.title}** ${url}`);
      }
    }
  }

  // Technical details
  lines.push("");
  lines.push("## Technical Details");
  lines.push("");
  const sitemapUrl = getCanonicalUrl("/sitemap.xml");
  const robotsUrl = getCanonicalUrl("/robots.txt");
  if (sitemapUrl) lines.push(`- Sitemap: ${sitemapUrl}`);
  if (robotsUrl) lines.push(`- Robots: ${robotsUrl}`);

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
