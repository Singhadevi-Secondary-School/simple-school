import type React from "react";
import type { TModel as CoreModel } from "@/configuration/core";
import type { TModel as NavigationModel } from "@/configuration/navigation";
import type { TModel as OrganizationsModel } from "@/configuration/organizations";

export interface NoticePopupItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  href: string;
}

export interface LayoutContentProps {
  children: React.ReactNode;
  coreConfig: CoreModel;
  navigationConfig: NavigationModel;
  organizationsConfig: OrganizationsModel;
  noticePopupItems: NoticePopupItem[];
}
