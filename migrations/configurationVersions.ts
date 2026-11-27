export const currentConfigurationVersions: Record<string, number> = {
  about: 0,
  content: 0,
  contents: 0,
  core: 0,
  downloads: 0,
  grievance: 0,
  home: 0,
  navigation: 0,
  organization: 0,
  organizations: 0,
  people: 0,
  person: 0,
  result: 0,
  results: 0,
};

export function serializeConfiguration(
  identifier: string,
  configuration: unknown,
): string {
  const currentVersion = currentConfigurationVersions[identifier];
  if (currentVersion === undefined) {
    throw new Error(`Unknown configuration identifier "${identifier}".`);
  }

  return `${JSON.stringify(
    {
      version: currentVersion,
      configuration,
    },
    null,
    2,
  )}\n`;
}
