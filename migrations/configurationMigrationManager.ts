import { initialAboutMigration } from "@/migrations/about/initial";
import { currentConfigurationVersions } from "@/migrations/configurationVersions";
import { initialContentsMigration } from "@/migrations/contents/initial";
import { initialCoreMigration } from "@/migrations/core/initial";
import { initialDownloadsMigration } from "@/migrations/downloads/initial";
import { initialGrievanceMigration } from "@/migrations/grievance/initial";
import { initialHomeMigration } from "@/migrations/home/initial";
import { initialNavigationMigration } from "@/migrations/navigation/initial";
import { initialOrganizationsMigration } from "@/migrations/organizations/initial";
import { initialPeopleMigration } from "@/migrations/people/initial";
import { initialResultsMigration } from "@/migrations/results/initial";

type ConfigurationMigration = (configuration: unknown) => unknown;
type InitialMigration = () => unknown;

type ConfigurationMigrationMap = Record<number, ConfigurationMigration>;

type VersionedConfiguration = {
  version: number;
  configuration: unknown;
};

const initialConfigurationVersion = 0;

const initialMigrationMap: Record<string, InitialMigration> = {
  about: initialAboutMigration,
  contents: initialContentsMigration,
  core: initialCoreMigration,
  downloads: initialDownloadsMigration,
  grievance: initialGrievanceMigration,
  home: initialHomeMigration,
  navigation: initialNavigationMigration,
  organizations: initialOrganizationsMigration,
  people: initialPeopleMigration,
  results: initialResultsMigration,
};

const configurationMigrationManager: Record<string, ConfigurationMigrationMap> =
  {
    about: {},
    content: {},
    contents: {},
    core: {},
    downloads: {},
    grievance: {},
    home: {},
    navigation: {},
    organization: {},
    organizations: {},
    people: {},
    person: {},
    result: {},
    results: {},
  };

const idBasedConfigurationDirectories: Record<string, string> = {
  content: "contents",
  organization: "organizations",
  person: "people",
  result: "results",
};

function isVersionedConfiguration(
  value: unknown,
): value is VersionedConfiguration {
  return (
    typeof value === "object" &&
    value !== null &&
    "version" in value &&
    "configuration" in value
  );
}

function getConfigurationVersion(
  value: VersionedConfiguration | unknown,
): number {
  if (!isVersionedConfiguration(value)) {
    return initialConfigurationVersion;
  }

  if (!Number.isInteger(value.version) || value.version < 0) {
    throw new Error(
      `Configuration version must be a positive integer. Found: ${value.version}.`,
    );
  }

  return value.version;
}

export function migrateConfiguration(
  identifier: string,
  value: unknown | null,
): VersionedConfiguration {
  const currentVersion = currentConfigurationVersions[identifier];
  if (currentVersion === undefined) {
    throw new Error(`Unknown configuration identifier "${identifier}".`);
  }

  if (value == null) {
    if (idBasedConfigurationDirectories[identifier] != null) {
      return {
        version: currentVersion,
        configuration: null,
      };
    }
    if (initialMigrationMap[identifier] == null) {
      throw new Error(
        `No initial migration defined for configuration "${identifier}".`,
      );
    }
    value = initialMigrationMap[identifier]();
  }

  const version = getConfigurationVersion(value);
  if (version > currentVersion) {
    throw new Error(
      `Configuration "${identifier}" is version ${version}, but this application only supports version ${currentVersion}.`,
    );
  }

  let configuration = isVersionedConfiguration(value)
    ? value.configuration
    : value;

  for (
    let nextVersion = version + 1;
    nextVersion <= currentVersion;
    nextVersion += 1
  ) {
    const migration = configurationMigrationManager[identifier][nextVersion];
    if (!migration) {
      throw new Error(
        `Missing migration for configuration "${identifier}" from version ${nextVersion - 1} to ${nextVersion}.`,
      );
    }

    configuration = migration(configuration);
  }

  return {
    version: currentVersion,
    configuration,
  };
}

export { serializeConfiguration } from "@/migrations/configurationVersions";
export { idBasedConfigurationDirectories };
