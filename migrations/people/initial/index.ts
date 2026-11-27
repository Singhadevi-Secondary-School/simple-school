import { existsSync } from "node:fs";
import { join } from "node:path";
import { getConfigurationDirectory } from "@/configuration/configurationFiles";
import { defaultValues } from "@/configuration/people";

export function initialPeopleMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "people.json");
  if (existsSync(configPath)) {
    throw new Error(
      `Configuration file "people.json" already exists. Initial migration cannot be performed.`,
    );
  }

  return defaultValues;
}
