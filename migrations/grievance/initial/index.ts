import { existsSync } from "node:fs";
import { join } from "node:path";
import { getConfigurationDirectory } from "@/configuration/configurationFiles";
import { defaultValues } from "@/configuration/grievance";

export function initialGrievanceMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "grievance.json");
  if (existsSync(configPath)) {
    throw new Error(
      `Configuration file "grievance.json" already exists. Initial migration cannot be performed.`,
    );
  }

  return defaultValues;
}
