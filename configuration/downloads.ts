import * as z from "zod";

export const downloadEntrySchema = z
  .object({
    name: z.string().min(1, "Document name is required.").meta({
      title: "Document Name",
      description:
        "The display name of the document, e.g. 'Academic Calendar 2083 BS'.",
    }),
    url: z.string().min(1, "Download URL is required.").meta({
      title: "Download URL",
      description: "A URL to a downloadable file.",
    }),
  })
  .meta({
    title: "Download",
    description: "A downloadable file entry with its name and URL.",
  });

export const schema = z
  .object({
    summary: z.string().min(1, "Summary is required.").meta({
      title: "Summary",
      description:
        "A short introduction shown at the top of the downloads page and used as its search result description.",
    }),
    downloads: z.array(downloadEntrySchema).default([]).meta({
      title: "Downloads",
      description:
        "The list of downloadable files available on the downloads page.",
    }),
  })
  .meta({
    title: "Downloads Configuration",
    description: "Configuration for the downloads page and its file list.",
  });

export const buildSchema = schema
  .extend({
    summary: z.string(),
  })
  .partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  summary: "",
  downloads: [],
};
