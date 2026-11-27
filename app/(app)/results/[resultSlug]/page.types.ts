import type { TModel as ResultModel } from "@/configuration/result";
import type { TModel as ResultsModel } from "@/configuration/results";

export type ResultDetail = ResultsModel["results"][number] & ResultModel;

export interface PageContentProps {
  result: ResultDetail;
  schoolName: string;
}
