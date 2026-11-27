import { existsSync } from "node:fs";
import { join } from "node:path";
import { getConfigurationDirectory } from "@/configuration/configurationFiles";
import { defaultValues } from "@/configuration/contact";

export function initialContactMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "contact.json");
  if (existsSync(configPath)) {
    throw new Error(
      `Configuration file "contact.json" already exists. Initial migration cannot be performed.`,
    );
  }

  return defaultValues;
}
