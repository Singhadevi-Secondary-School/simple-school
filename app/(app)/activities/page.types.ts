import type { TModel as ContentModel } from "@/configuration/content";
import type { TModel as ContentsModel } from "@/configuration/contents";

export type ActivityItem = ContentsModel["list"][number] & ContentModel;

export interface PageContentProps {
  activitiesConfig: ContentsModel["list"];
}
