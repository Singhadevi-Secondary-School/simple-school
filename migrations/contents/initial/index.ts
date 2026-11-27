import { existsSync } from "node:fs";
import { join } from "node:path";
import { getConfigurationDirectory } from "@/configuration/configurationFiles";
import { defaultValues } from "@/configuration/contents";

export function initialContentsMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "contents.json");
  if (existsSync(configPath)) {
    throw new Error(
      `Configuration file "contents.json" already exists. Initial migration cannot be performed.`,
    );
  }

  return defaultValues;
}
