import * as z from "zod";

export const schema = z
  .object({
    photo: z.url("The photo url must be valid").optional().meta({
      title: "Photo",
      description: "The URL of the person's photo, shown on people cards.",
    }),
    phone: z.string().optional().meta({
      title: "Phone",
      description: "The phone number of the person.",
    }),
    email: z.string().optional().meta({
      title: "Email",
      description: "The email address of the person.",
    }),
    schedules: z
      .array(
        z
          .object({
            weekday: z.string().min(1, "Weekday is required.").meta({
              title: "Weekday",
              description: "The day of the week, e.g. 'Monday', 'Tuesday'.",
            }),
            from: z.string().min(1, "From time is required.").meta({
              title: "From",
              description: "The start time in HH:MM format, e.g. '09:00'.",
            }),
            to: z.string().min(1, "To time is required.").meta({
              title: "To",
              description: "The end time in HH:MM format, e.g. '17:00'.",
            }),
            description: z.string().optional().meta({
              title: "Description",
              description:
                "An optional description of the schedule, e.g. 'Office hours'.",
            }),
          })
          .meta({
            title: "Schedule",
            description: "A time slot for the person's availability.",
          }),
      )
      .default([])
      .meta({
        title: "Schedules",
        description:
          "The person's schedule, such as office hours or class timings.",
      }),
  })
  .meta({
    title: "Person Details",
    description:
      "Optional photo, contact information, and schedule for a person, stored in a file named after their ID.",
  });

export const buildSchema = schema.extend({}).partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  photo: "",
  phone: "",
  email: "",
  schedules: [],
};
