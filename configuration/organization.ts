import * as z from "zod";

export const schema = z
  .object({
    summary: z.string().optional().meta({
      title: "Summary",
      description:
        "A description of the organisation shown on its detail page.",
    }),
    people: z
      .array(
        z
          .object({
            id: z.string().min(1, "Person ID is required.").meta({
              title: "Person ID",
              description: "The ID of a person from the people configuration.",
            }),
            position: z.string().min(1, "Position is required.").meta({
              title: "Position",
              description:
                "The person's role or position in this organisation, e.g. 'Class Teacher', 'Head of Department'.",
            }),
          })
          .meta({
            title: "Person",
            description:
              "A person associated with this organisation and their position.",
          }),
      )
      .default([])
      .meta({
        title: "People",
        description:
          "The people associated with this organisation, such as teachers, students, or committee members.",
      }),
  })
  .meta({
    title: "Organisation Details",
    description:
      "Detailed information for an organisation, stored in a file named after its ID.",
  });

export const buildSchema = schema.extend({}).partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  summary: "",
  people: [],
};
