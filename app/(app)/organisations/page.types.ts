import type { TModel as CoreModel } from "@/configuration/core";
import type { TModel as OrganizationsModel } from "@/configuration/organizations";

export interface PageContentProps {
  organisationsConfig: OrganizationsModel;
  coreConfig: CoreModel;
}
