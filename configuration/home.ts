import * as z from "zod";

export const schema = z
  .object({
    heroTitle: z.string().min(1, "Hero title is required.").meta({
      title: "Hero Title",
      description:
        "The main heading displayed on the home page hero banner, e.g. 'Learn. Grow. Lead.'",
    }),
    heroDescription: z.string().min(1, "Hero description is required.").meta({
      title: "Hero Description",
      description:
        "A short tagline or description shown below the hero title on the home page.",
    }),
    heroPicture: z
      .url("The hero picture must be a valid URL")
      .min(1, "Hero picture URL is required.")
      .meta({
        title: "Hero Picture",
        description:
          "The background image for the home page hero banner, such as a campus or courtyard photo.",
      }),
    latestNoticesCount: z.number().int().min(0).default(5).meta({
      title: "Latest Notices Count",
      description: "The number of recent notices to display on the home page.",
    }),
    recentPublicationsCount: z.number().int().min(0).default(5).meta({
      title: "Recent Publications Count",
      description:
        "The number of recent publications to display on the home page.",
    }),
  })
  .meta({
    title: "Home Configuration",
    description:
      "Configuration for the home page hero banner and the content sections shown below it.",
  });

export const buildSchema = schema
  .extend({
    heroTitle: z.string(),
    heroDescription: z.string(),
    heroPicture: z.union([
      z.literal(""),
      z.url("The hero picture must be a valid URL"),
    ]),
  })
  .partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  heroTitle: "",
  heroDescription: "",
  heroPicture: "",
  latestNoticesCount: 5,
  recentPublicationsCount: 5,
};
