import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getConfigurationDirectory } from "@/configuration/configurationFiles";
import {
  idBasedConfigurationDirectories,
  migrateConfiguration,
} from "@/migrations/configurationMigrationManager";

type ConfigurationFile = {
  identifier: string;
  path: string;
};

const configurationDirectory = getConfigurationDirectory();

const configurationFiles: ConfigurationFile[] = [
  { identifier: "about", path: "about.json" },
  { identifier: "contents", path: "contents.json" },
  { identifier: "core", path: "core.json" },
  { identifier: "downloads", path: "downloads.json" },
  { identifier: "grievance", path: "grievance.json" },
  { identifier: "home", path: "home.json" },
  { identifier: "navigation", path: "navigation.json" },
  { identifier: "organizations", path: "organizations.json" },
  { identifier: "people", path: "people.json" },
  { identifier: "results", path: "results.json" },
];

function getIdBasedConfigurationFiles(): ConfigurationFile[] {
  const files: ConfigurationFile[] = [];
  for (const [identifier, directory] of Object.entries(
    idBasedConfigurationDirectories,
  )) {
    const dirPath = join(configurationDirectory, directory);
    if (!existsSync(dirPath)) {
      continue;
    }
    const jsonFiles = readdirSync(dirPath).filter((f) => f.endsWith(".json"));
    for (const fileName of jsonFiles) {
      files.push({
        identifier,
        path: join(directory, fileName),
      });
    }
  }
  return files;
}

for (const file of [...configurationFiles, ...getIdBasedConfigurationFiles()]) {
  const filePath = join(configurationDirectory, file.path);

  let configuration = null;
  let source = "";
  if (existsSync(filePath)) {
    source = readFileSync(filePath, "utf8");
    configuration = JSON.parse(source) as unknown;
  }

  const migratedConfiguration = migrateConfiguration(
    file.identifier,
    configuration,
  );
  const output = `${JSON.stringify(migratedConfiguration, null, 2)}\n`;

  if (source !== output) {
    writeFileSync(filePath, output);
    console.log(
      `Migrated ${file.path} to version ${migratedConfiguration.version}.`,
    );
  }
}
