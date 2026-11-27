import * as z from "zod";

export const schema = z
  .object({
    contactImage: z
      .url("Contact image must be a valid URL")
      .min(1, "Contact image URL is required.")
      .meta({
        title: "Contact Image",
        description:
          "An image displayed on the grievance/contact page, such as a school building or contact person photo.",
      }),
    contactName: z.string().min(1, "Contact name is required.").meta({
      title: "Contact Name",
      description:
        "The name of the contact person or office, e.g. 'Grievance Officer'.",
    }),
    contactSummary: z.string().min(1, "Contact summary is required.").meta({
      title: "Contact Summary",
      description: "A brief description of the contact or grievance office.",
    }),
    contactEmail: z.string().min(1, "Contact email is required.").meta({
      title: "Contact Email",
      description: "The email address for contacting the grievance office.",
    }),
    contactPhone: z.string().min(1, "Contact phone is required.").meta({
      title: "Contact Phone",
      description: "The phone number for the grievance office.",
    }),
    contactAddress: z.string().min(1, "Contact address is required.").meta({
      title: "Contact Address",
      description: "The physical address of the grievance office.",
    }),
    contactHour: z.string().min(1, "Contact hours are required.").meta({
      title: "Contact Hours",
      description:
        "The operating hours of the grievance office, e.g. 'Mon-Fri, 9:00 AM - 5:00 PM'.",
    }),
  })
  .meta({
    title: "Grievance & Contact Configuration",
    description:
      "Configuration for the grievance and contact page, including contact details and office hours.",
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
