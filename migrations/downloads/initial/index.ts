import { existsSync } from "node:fs";
import { join } from "node:path";
import { getConfigurationDirectory } from "@/configuration/configurationFiles";
import { defaultValues } from "@/configuration/downloads";

export function initialDownloadsMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "downloads.json");
  if (existsSync(configPath)) {
    throw new Error(
      `Configuration file "downloads.json" already exists. Initial migration cannot be performed.`,
    );
  }

  return defaultValues;
}
