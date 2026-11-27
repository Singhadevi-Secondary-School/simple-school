import * as z from "zod";

export const schema = z
  .object({
    logoIcon: z
      .url("Logo icon must be a valid URL")
      .min(1, "Logo icon is required.")
      .meta({
        title: "Logo icon",
        description:
          "An icon that will be used as a favicon for the website. " +
          "It is recommended to use a square image of size 512x512px.",
      }),
    schoolName: z
      .string("School Name is required")
      .min(1, "School name is required.")
      .meta({
        title: "School Name",
        description:
          "The official name of the school. This will be used anywhere " +
          "the school name is required, such as in the header, the about page, " +
          "and the SEO metadata.",
      }),
    location: z.string().optional().meta({
      title: "Location",
      description:
        "The location of the school, e.g. 'Jhamsikhel, Lalitpur · Nepal'.",
    }),
    logo: z
      .url("Logo must be a valid URL")
      .min(1, "Logo URL is required.")
      .meta({
        title: "Logo",
        description:
          "The school logo displayed in the header and other prominent areas. " +
          "It is recommended to use a square or rectangular image.",
      }),
    seoDescription: z.string().optional().meta({
      title: "SEO Description",
      description:
        "A short description of the school website that will be used in the SEO metadata.",
    }),
    seoKeywords: z
      .array(
        z
          .string("Please enter a valid keyword")
          .min(1, "Keyword is required.")
          .meta({
            title: "SEO Keyword",
            description: "A search term associated with the website.",
          }),
      )
      .default([])
      .meta({
        title: "SEO Keywords",
        description:
          "Short search terms that describe the school website. Enter plain words separated by commas; " +
          "avoid repeating the school name or writing complete sentences.",
      }),
    template: z
      .string()
      .min(1, "Template is required.")
      .default("default")
      .meta({
        title: "Template",
        description:
          "The visual template used for rendering content pages. " +
          "Options are determined by the folders inside the templates directory.",
      }),
    daysToShowNoticePopupFor: z.number().int().min(0).default(3).meta({
      title: "Days to Show Notice Popups For",
      description:
        "The number of days after publication that a notice may appear in a popup. Set to 0 to disable notice popups.",
    }),
  })
  .meta({
    title: "Core Configuration",
    description:
      "Site-wide identity and search metadata used throughout the school website.",
  });

export const buildSchema = schema
  .extend({
    logoIcon: z.union([z.literal(""), z.url("Logo Icon must be a valid URL")]),
    schoolName: z.string(),
    logo: z.union([z.literal(""), z.url("Logo must be a valid URL")]),
    template: z.string(),
  })
  .partial()
  .extend({
    daysToShowNoticePopupFor: schema.shape.daysToShowNoticePopupFor,
  });

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  schoolName: "",
  location: "",
  logo: "",
  logoIcon: "",
  seoDescription: "",
  seoKeywords: [],
  template: "default",
  daysToShowNoticePopupFor: 3,
};
