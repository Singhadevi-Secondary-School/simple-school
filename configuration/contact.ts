import * as z from "zod";

export const schema = z
  .object({
    contactImage: z
      .url("Contact image must be a valid URL")
      .min(1, "Contact image URL is required.")
      .meta({
        title: "Contact Image",
        description:
          "An image displayed on the contact page, such as a school building or contact person photo.",
      }),
    contactName: z.string().min(1, "Contact name is required.").meta({
      title: "Contact Name",
      description: "The name of the contact person or office.",
    }),
    contactSummary: z.string().min(1, "Contact summary is required.").meta({
      title: "Contact Summary",
      description: "A brief description of the contact office.",
    }),
    contactEmail: z.string().min(1, "Contact email is required.").meta({
      title: "Contact Email",
      description: "The email address for contacting the institution.",
    }),
    contactPhone: z.string().min(1, "Contact phone is required.").meta({
      title: "Contact Phone",
      description: "The phone number for contacting the institution.",
    }),
    contactAddress: z.string().min(1, "Contact address is required.").meta({
      title: "Contact Address",
      description: "The physical address of the institution.",
    }),
    contactHour: z.string().min(1, "Contact hours are required.").meta({
      title: "Contact Hours",
      description:
        "The contact office's operating hours, e.g. 'Mon-Fri, 9:00 AM - 5:00 PM'.",
    }),
  })
  .meta({
    title: "Contact & Feedback Configuration",
    description:
      "Configuration for the contact page, including contact details and office hours.",
  });

export const buildSchema = schema
  .extend({
    contactImage: z.union([
      z.literal(""),
      z.url("Contact image must be a valid URL"),
    ]),
    contactName: z.string(),
    contactSummary: z.string(),
    contactEmail: z.string(),
    contactPhone: z.string(),
    contactAddress: z.string(),
    contactHour: z.string(),
  })
  .partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  contactImage: "",
  contactName: "",
  contactSummary: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  contactHour: "",
};
