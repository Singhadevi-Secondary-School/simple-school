import type { MetadataRoute } from "next";
import {
  ContentsConfig,
  NavigationConfig,
  OrganizationsConfig,
  ResultsConfig,
} from "@/configuration";
import { getAbsoluteUrl, getCanonicalUrl } from "@/lib/pageMetadata";

export const dynamic = "force-static";

const MENU_PATH_MAP = [
  { menu: "home", path: "/", priority: 1, changeFrequency: "monthly" as const },
  {
    menu: "about",
    path: "/about/",
    priority: 0.9,
    changeFrequency: "monthly" as const,
  },
  {
    menu: "notices",
    path: "/notices/",
    priority: 0.8,
    changeFrequency: "daily" as const,
  },
  {
    menu: "publications",
    path: "/publications/",
    priority: 0.8,
    changeFrequency: "daily" as const,
  },
  {
    menu: "activities",
    path: "/activities/",
    priority: 0.8,
    changeFrequency: "daily" as const,
  },
  {
    menu: "all-staffs",
    path: "/all-staffs/",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    menu: "faculties",
    path: "/faculties/",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    menu: "classes",
    path: "/classes/",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    menu: "organisations",
    path: "/organisations/",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    menu: "results",
    path: "/results/",
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  {
    menu: "downloads",
    path: "/downloads/",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    menu: "grievance",
    path: "/grievance/",
    priority: 0.5,
    changeFrequency: "monthly" as const,
  },
];

const staticRoutes = MENU_PATH_MAP.filter((item) =>
  NavigationConfig.enabledNavigations.includes(item.menu),
);

function getSitemapSlug(slugs: { slug: string; isActive: boolean }[]) {
  return slugs.find((s) => s.isActive)?.slug || slugs[0]?.slug;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = staticRoutes.flatMap((route) => {
    const url = getCanonicalUrl(route.path);
    return url
      ? [
          {
            url,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
          },
        ]
      : [];
  });

  if (NavigationConfig.enabledNavigations.includes("notices")) {
    for (const item of ContentsConfig.list.filter((c) => c.type === "notice")) {
      const slug = getSitemapSlug(item.slugs);
      const url = slug ? getCanonicalUrl(`/notices/${slug}/`) : undefined;
      if (url) {
        urls.push({
          url,
          lastModified: item.date,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        });
      }
    }
  }

  if (NavigationConfig.enabledNavigations.includes("publications")) {
    for (const item of ContentsConfig.list.filter(
      (c) => c.type === "publication",
    )) {
      const slug = getSitemapSlug(item.slugs);
      const url = slug ? getCanonicalUrl(`/publications/${slug}/`) : undefined;
      if (url) {
        urls.push({
          url,
          lastModified: item.date,
          changeFrequency: "weekly" as const,
          priority: 0.7,
          images: item.coverImage
            ? [getAbsoluteUrl(item.coverImage)]
            : undefined,
        });
      }
    }
  }

  if (NavigationConfig.enabledNavigations.includes("activities")) {
    for (const item of ContentsConfig.list.filter(
      (c) => c.type === "activity",
    )) {
      const slug = getSitemapSlug(item.slugs);
      const url = slug ? getCanonicalUrl(`/activities/${slug}/`) : undefined;
      if (url) {
        urls.push({
          url,
          lastModified: item.date,
          changeFrequency: "weekly" as const,
          priority: 0.7,
          images: item.coverImage
            ? [getAbsoluteUrl(item.coverImage)]
            : undefined,
        });
      }
    }
  }

  if (NavigationConfig.enabledNavigations.includes("faculties")) {
    for (const org of OrganizationsConfig.organizations.filter(
      (o) => o.type === "Faculty",
    )) {
      const slug = getSitemapSlug(org.slugs);
      const url = slug ? getCanonicalUrl(`/faculties/${slug}/`) : undefined;
      if (url) {
        urls.push({
          url,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        });
      }
    }
  }

  if (NavigationConfig.enabledNavigations.includes("classes")) {
    for (const org of OrganizationsConfig.organizations.filter(
      (o) => o.type === "Class",
    )) {
      const slug = getSitemapSlug(org.slugs);
      const url = slug ? getCanonicalUrl(`/classes/${slug}/`) : undefined;
      if (url) {
        urls.push({
          url,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        });
      }
    }
  }

  if (NavigationConfig.enabledNavigations.includes("organisations")) {
    for (const org of OrganizationsConfig.organizations.filter(
      (o) => o.type === "Others",
    )) {
      const slug = getSitemapSlug(org.slugs);
      const url = slug ? getCanonicalUrl(`/organisations/${slug}/`) : undefined;
      if (url) {
        urls.push({
          url,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        });
      }
    }
  }

  if (NavigationConfig.enabledNavigations.includes("results")) {
    for (const result of ResultsConfig.results) {
      const slug = getSitemapSlug(result.slugs);
      const url = slug ? getCanonicalUrl(`/results/${slug}/`) : undefined;
      if (url) {
        urls.push({
          url,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        });
      }
    }
  }

  return urls;
}
