"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type TOutput as AboutConfigurationOutput,
  schema as AboutConfigurationSchema,
} from "@/configuration/about";
import {
  type TOutput as ContactConfigurationOutput,
  schema as ContactConfigurationSchema,
} from "@/configuration/contact";
import {
  type TOutput as ContentConfigurationOutput,
  schema as ContentConfigurationSchema,
} from "@/configuration/content";
import {
  type TOutput as ContentsConfigurationOutput,
  schema as ContentsConfigurationSchema,
} from "@/configuration/contents";
import {
  type TOutput as CoreConfigurationOutput,
  schema as CoreConfigurationSchema,
} from "@/configuration/core";
import {
  type TOutput as DownloadsConfigurationOutput,
  schema as DownloadsConfigurationSchema,
} from "@/configuration/downloads";
import {
  type TOutput as HomeConfigurationOutput,
  schema as HomeConfigurationSchema,
} from "@/configuration/home";
import {
  type TOutput as NavigationConfigurationOutput,
  schema as NavigationConfigurationSchema,
} from "@/configuration/navigation";
import {
  type TOutput as OrganizationConfigurationOutput,
  schema as OrganizationConfigurationSchema,
} from "@/configuration/organization";
import {
  type TOutput as OrganizationsConfigurationOutput,
  schema as OrganizationsConfigurationSchema,
} from "@/configuration/organizations";
import {
  type TOutput as PeopleConfigurationOutput,
  schema as PeopleConfigurationSchema,
} from "@/configuration/people";
import {
  type TOutput as PersonConfigurationOutput,
  schema as PersonConfigurationSchema,
} from "@/configuration/person";
import {
  type TOutput as ResultConfigurationOutput,
  schema as ResultConfigurationSchema,
} from "@/configuration/result";
import {
  type TOutput as ResultsConfigurationOutput,
  schema as ResultsConfigurationSchema,
} from "@/configuration/results";
import { useGitHubPatAuth } from "@/hooks/useGitHubPatAuth";
import { getGitHubFileContent, uploadGitHubFiles } from "@/lib/gitHub";
import { serializeConfiguration } from "@/migrations/configurationVersions";

export enum Identifier {
  Core = "core",
  Navigation = "navigation",
  Home = "home",
  About = "about",
  Contents = "contents",
  Content = "content",
  Downloads = "downloads",
  Contact = "contact",
  Organizations = "organizations",
  Organization = "organization",
  People = "people",
  Person = "person",
  Results = "results",
  Result = "result",
}

type ConfigurationModelMap = {
  [Identifier.Core]: CoreConfigurationOutput;
  [Identifier.Navigation]: NavigationConfigurationOutput;
  [Identifier.Home]: HomeConfigurationOutput;
  [Identifier.About]: AboutConfigurationOutput;
  [Identifier.Contents]: ContentsConfigurationOutput;
  [Identifier.Content]: ContentConfigurationOutput;
  [Identifier.Downloads]: DownloadsConfigurationOutput;
  [Identifier.Contact]: ContactConfigurationOutput;
  [Identifier.Organizations]: OrganizationsConfigurationOutput;
  [Identifier.Organization]: OrganizationConfigurationOutput;
  [Identifier.People]: PeopleConfigurationOutput;
  [Identifier.Person]: PersonConfigurationOutput;
  [Identifier.Results]: ResultsConfigurationOutput;
  [Identifier.Result]: ResultConfigurationOutput;
};

type ConfigQuery = Record<string, string | number | null>;
type ConfigurationModel<K extends Identifier> = ConfigurationModelMap[K];
type ConfigHookResult<T extends Identifier> = {
  config: ConfigurationModel<T> | undefined;
  isLoadingConfig: boolean;
  saveConfig: (config: ConfigurationModel<T>) => Promise<void>;
  isSavingConfig: boolean;
};

const configurationPaths: Record<Identifier, (query?: ConfigQuery) => string> =
  {
    [Identifier.Core]: (_) => `public/config/core.json`,
    [Identifier.Navigation]: (_) => `public/config/navigation.json`,
    [Identifier.Home]: (_) => `public/config/home.json`,
    [Identifier.About]: (_) => `public/config/about.json`,
    [Identifier.Contents]: (_) => `public/config/contents.json`,
    [Identifier.Content]: (query) =>
      `public/config/contents/${query ? query.id : "empty"}.json`,
    [Identifier.Downloads]: (_) => `public/config/downloads.json`,
    [Identifier.Contact]: (_) => `public/config/contact.json`,
    [Identifier.Organizations]: (_) => `public/config/organizations.json`,
    [Identifier.Organization]: (query) =>
      `public/config/organizations/${query ? query.id : "empty"}.json`,
    [Identifier.People]: (_) => `public/config/people.json`,
    [Identifier.Person]: (query) =>
      `public/config/people/${query ? query.id : "empty"}.json`,
    [Identifier.Results]: (_) => `public/config/results.json`,
    [Identifier.Result]: (query) =>
      `public/config/results/${query ? query.id : "empty"}.json`,
  };

const configurationSchemas = {
  [Identifier.Core]: CoreConfigurationSchema,
  [Identifier.Navigation]: NavigationConfigurationSchema,
  [Identifier.Home]: HomeConfigurationSchema,
  [Identifier.About]: AboutConfigurationSchema,
  [Identifier.Contents]: ContentsConfigurationSchema,
  [Identifier.Content]: ContentConfigurationSchema,
  [Identifier.Downloads]: DownloadsConfigurationSchema,
  [Identifier.Contact]: ContactConfigurationSchema,
  [Identifier.Organizations]: OrganizationsConfigurationSchema,
  [Identifier.Organization]: OrganizationConfigurationSchema,
  [Identifier.People]: PeopleConfigurationSchema,
  [Identifier.Person]: PersonConfigurationSchema,
  [Identifier.Results]: ResultsConfigurationSchema,
  [Identifier.Result]: ResultConfigurationSchema,
};

export function useConfig<T extends Identifier>(
  configIdentifier: T,
  query?: ConfigQuery,
): ConfigHookResult<T> {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [configIdentifier, query],
    queryFn: async () =>
      await getConfig(
        configIdentifier,
        query,
        gitHubPat,
        gitHubSession?.repository?.full_name || "",
      ),
    refetchOnWindowFocus: false,
  });

  const { gitHubPat, gitHubSession } = useGitHubPatAuth();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [configIdentifier, query],
    mutationFn: async (newConfig: ConfigurationModel<T>) =>
      await saveConfig(
        configIdentifier,
        query,
        newConfig,
        gitHubPat,
        gitHubSession?.repository?.full_name || "",
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [configIdentifier, query],
      });
      toast.success(`Config saved successfully: ${configIdentifier}`);
    },
    onError: async (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : `Failed to save ${configIdentifier} config.`;
      toast.error(errorMessage);
    },
  });

  return {
    config: data,
    isLoadingConfig: isLoading,
    saveConfig: mutateAsync,
    isSavingConfig: isPending,
  };
}

async function saveConfig<T extends Identifier>(
  configIdentifier: T,
  query: ConfigQuery | undefined,
  newConfig: ConfigurationModel<T>,
  gitHubPat: string | null,
  repo: string,
): Promise<void> {
  const configPathFunction = configurationPaths[configIdentifier];
  const filePath = configPathFunction(query);
  const content = serializeConfiguration(configIdentifier, newConfig);
  await uploadGitHubFiles(
    gitHubPat ?? "",
    repo,
    filePath.substring(0, filePath.lastIndexOf("/")),
    [
      {
        name: filePath.substring(filePath.lastIndexOf("/") + 1),
        content,
      },
    ],
  );
}

async function getConfig<T extends Identifier>(
  configIdentifier: T,
  query: ConfigQuery | undefined,
  gitHubPat: string | null,
  repo: string,
): Promise<ConfigurationModel<T>> {
  const configPathFunction = configurationPaths[configIdentifier];
  const filePath = configPathFunction(query);
  const response = await getGitHubFileContent(gitHubPat ?? "", repo, filePath);

  return configurationSchemas[configIdentifier].parse(
    JSON.parse(response).configuration,
  ) as ConfigurationModel<T>;
}
