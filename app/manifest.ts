import type { MetadataRoute } from "next";
import { CoreConfig, HomeConfig } from "@/configuration";
import { getSiteDescription, getSiteName } from "@/lib/pageMetadata";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: getSiteName(),
    short_name: getSiteName(),
    description:
      getSiteDescription() || HomeConfig.heroDescription || "School Website",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: CoreConfig.logoIcon || "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
