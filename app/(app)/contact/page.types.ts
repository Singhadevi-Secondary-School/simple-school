import type { TModel as ContactModel } from "@/configuration/contact";
import type { TModel as NavigationModel } from "@/configuration/navigation";

export interface PageContentProps {
  contactConfig: ContactModel;
  navigationConfig: NavigationModel;
}
