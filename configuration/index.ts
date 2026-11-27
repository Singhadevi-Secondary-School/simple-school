import type { TOutput as AboutOutput } from "@/configuration/about";
import { buildSchema as aboutSchema } from "@/configuration/about";
import { readConfigurationFromFile } from "@/configuration/configurationFiles";
export const AboutConfig: AboutOutput = aboutSchema.parse(
  readConfigurationFromFile("about.json"),
) as AboutOutput;

import type { TOutput as ContentsOutput } from "@/configuration/contents";
import { buildSchema as contentsSchema } from "@/configuration/contents";
export const ContentsConfig: ContentsOutput = contentsSchema.parse(
  readConfigurationFromFile("contents.json"),
) as ContentsOutput;

import type { TOutput as CoreOutput } from "@/configuration/core";
import { buildSchema as coreSchema } from "@/configuration/core";
export const CoreConfig: CoreOutput = coreSchema.parse(
  readConfigurationFromFile("core.json"),
) as CoreOutput;

import type { TOutput as DownloadsOutput } from "@/configuration/downloads";
import { buildSchema as downloadsSchema } from "@/configuration/downloads";
export const DownloadsConfig: DownloadsOutput = downloadsSchema.parse(
  readConfigurationFromFile("downloads.json"),
) as DownloadsOutput;

import type { TOutput as GrievanceOutput } from "@/configuration/grievance";
import { buildSchema as grievanceSchema } from "@/configuration/grievance";
export const GrievanceConfig: GrievanceOutput = grievanceSchema.parse(
  readConfigurationFromFile("grievance.json"),
) as GrievanceOutput;

import type { TOutput as HomeOutput } from "@/configuration/home";
import { buildSchema as homeSchema } from "@/configuration/home";
export const HomeConfig: HomeOutput = homeSchema.parse(
  readConfigurationFromFile("home.json"),
) as HomeOutput;

import type { TOutput as NavigationOutput } from "@/configuration/navigation";
import { buildSchema as navigationSchema } from "@/configuration/navigation";
export const NavigationConfig: NavigationOutput = navigationSchema.parse(
  readConfigurationFromFile("navigation.json"),
) as NavigationOutput;

import type { TOutput as OrganizationsOutput } from "@/configuration/organizations";
import { buildSchema as organizationsSchema } from "@/configuration/organizations";
export const OrganizationsConfig: OrganizationsOutput =
  organizationsSchema.parse(
    readConfigurationFromFile("organizations.json"),
  ) as OrganizationsOutput;

import type { TOutput as PeopleOutput } from "@/configuration/people";
import { buildSchema as peopleSchema } from "@/configuration/people";
export const PeopleConfig: PeopleOutput = peopleSchema.parse(
  readConfigurationFromFile("people.json"),
) as PeopleOutput;

import type { TOutput as ResultsOutput } from "@/configuration/results";
import { buildSchema as resultsSchema } from "@/configuration/results";
export const ResultsConfig: ResultsOutput = resultsSchema.parse(
  readConfigurationFromFile("results.json"),
) as ResultsOutput;
