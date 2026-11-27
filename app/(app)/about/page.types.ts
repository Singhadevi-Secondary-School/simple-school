import type { TModel as AboutModel } from "@/configuration/about";
import type { TModel as CoreModel } from "@/configuration/core";
import type { TModel as NavigationModel } from "@/configuration/navigation";

export interface PageContentProps {
  coreConfig: CoreModel;
  aboutConfig: AboutModel;
  navigationConfig: NavigationModel;
}
