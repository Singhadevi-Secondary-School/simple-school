import { existsSync } from "node:fs";
import { join } from "node:path";
import { getConfigurationDirectory } from "@/configuration/configurationFiles";
import { defaultValues } from "@/configuration/results";

export function initialResultsMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "results.json");
  if (existsSync(configPath)) {
    throw new Error(
      `Configuration file "results.json" already exists. Initial migration cannot be performed.`,
    );
  }

  return defaultValues;
}
