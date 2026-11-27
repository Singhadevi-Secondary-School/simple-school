import * as z from "zod";

export const schema = z
  .object({
    content: z.string().min(1, "Content is required.").meta({
      title: "Content",
      description: "The actual HTML content.",
    }),
  })
  .meta({
    title: "Content",
    description: "Actual content HTML for any postings.",
  });

export const buildSchema = schema.extend({}).partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  content: "",
};
