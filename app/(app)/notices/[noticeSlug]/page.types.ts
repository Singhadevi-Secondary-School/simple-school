import type { TModel as ContentModel } from "@/configuration/content";
import type { TModel as ContentsModel } from "@/configuration/contents";

export type NoticeItem = ContentsModel["list"][number] & ContentModel;

export interface PageContentProps {
  notice: NoticeItem;
  schoolName: string;
}
