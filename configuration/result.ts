import * as z from "zod";

export const schema = z
  .object({
    description: z.string().optional().meta({
      title: "Description",
      description: "HTML content describing the result in detail.",
    }),
    attachments: z
      .array(
        z.string().min(1, "Attachment URL is required.").meta({
          title: "Attachment URL",
          description: "A URL to a class-wide downloadable result file.",
        }),
      )
      .default([])
      .meta({
        title: "Class-wide Attachments",
        description:
          "PDF files for the whole class, such as mark sheets or result publications.",
      }),
    individualResults: z
      .array(
        z.string().min(1, "Individual result URL is required.").meta({
          title: "Individual Result URL",
          description:
            "A URL to one student's result PDF. Name each file symbolNumber_yyyy-mm-dd.pdf to match the lookup form.",
        }),
      )
      .default([])
      .meta({
        title: "Individual Results",
        description:
          "Student result PDF URLs. The filename must follow symbolNumber_yyyy-mm-dd.pdf for the lookup form to match it.",
      }),
  })
  .meta({
    title: "Result Details",
    description:
      "Detailed content and attachments for a result, stored in a file named after its ID.",
  });

export const buildSchema = schema.extend({}).partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  description: "",
  attachments: [],
  individualResults: [],
};
