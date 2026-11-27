import { existsSync } from "node:fs";
import { join } from "node:path";
import { getConfigurationDirectory } from "@/configuration/configurationFiles";
import { defaultValues } from "@/configuration/organizations";

export function initialOrganizationsMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "organizations.json");
  if (existsSync(configPath)) {
    throw new Error(
      `Configuration file "organizations.json" already exists. Initial migration cannot be performed.`,
    );
  }

  return defaultValues;
}
