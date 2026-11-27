import * as z from "zod";

export const schema = z
  .object({
    introPicture: z
      .url("Please provide a valid URL for the introduction picture.")
      .min(1, "Introduction picture URL is required.")
      .meta({
        title: "Introduction Picture",
        description:
          "A campus or school photo displayed alongside the introduction on the About page.",
      }),
    keypoints: z
      .array(
        z
          .object({
            title: z.string().min(1, "Key point title is required.").meta({
              title: "Key point title",
              description:
                "The label for this piece of key information, e.g. 'School Name', 'Established'.",
            }),
            value: z.string().min(1, "Key point value is required.").meta({
              title: "Key point value",
              description:
                "The value of the key point, e.g. 'Grade 10 · Batch 2083'. Links, email addresses and phone numbers are automatically detected and converted to clickable links.",
            }),
          })
          .meta({
            title: "Key point",
            description:
              "A piece of key information to display on the about page, such as School Name, Address, Area/Location, Established, or Grades Offered.",
          }),
      )
      .default([])
      .meta({
        title: "Key points",
        description:
          "A list of key information items to display on the about page.",
      }),
    story: z.string().min(1, "Introduction is required.").meta({
      title: "Story",
      description:
        "A paragraph or two telling the school's story, history, or mission.",
    }),
  })
  .meta({
    title: "About Configuration",
    description:
      "Configuration for the About page, including the school introduction, image, key information, and story.",
  });

export const buildSchema = schema
  .extend({
    introPicture: z.union([
      z.literal(""),
      z.url("Please provide a valid URL for the introduction picture."),
    ]),
    story: z.string()
  })
  .partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  introPicture: "",
  keypoints: [],
  story: "",
};
