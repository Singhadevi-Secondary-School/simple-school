import type { TModel as OrganizationModel } from "@/configuration/organization";
import type { TModel as OrganizationsModel } from "@/configuration/organizations";
import type { TModel as PeopleModel } from "@/configuration/people";
import type { TModel as PersonModel } from "@/configuration/person";

export type OrganizationDetail = OrganizationsModel["organizations"][number] &
  OrganizationModel & {
    people: (OrganizationModel["people"][number] &
      PeopleModel["people"][number] &
      PersonModel)[];
  };

export interface PageContentProps {
  organization: OrganizationDetail;
  schoolName: string;
}
