import { z } from "zod";

export const AddBusinessSchema = z.object({
  name: z
    .string({
      required_error: "Business Name is required",
    })
    .min(1),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1)
    .refine((desc) => desc.split(/\s+/).filter(Boolean).length <= 150, {
      message: "Description must be 150 words or less",
    }),
  legal: z.string({
    required_error: "Please select type of incorporation",
  }),
  year: z.string({
    required_error: "Please select year of incorporation",
  }),
  location: z.string({
    required_error: "Please select location",
  }),
  sector: z.string({
    required_error: "Please select sector",
  }),

  isBeneficialOwner: z.coerce.boolean({
    required_error: "Please select if you are a beneficial owner",
  }),
  specificPosition: z.string().optional(),
});

export const AddBusinessSchemaWithoutPosition = z.object({
  name: z
    .string({
      required_error: "Business Name is required",
    })
    .min(1),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1)
    .refine((desc) => desc.split(/\s+/).filter(Boolean).length <= 150, {
      message: "Description must be 150 words or less",
    }),
  incorporation: z.string({
    required_error: "Please select type of incorporation",
  }),
  year: z.string({
    required_error: "Please select year of incorporation",
  }),
  sector: z.string({
    required_error: "Please select sector",
  }),
});

export const AddBusinessSchemaNoOwnership = z.object({
  name: z
    .string({
      required_error: "Business Name is required",
    })
    .min(1),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1)
    .refine((desc) => desc.split(/\s+/).filter(Boolean).length <= 150, {
      message: "Description must be 150 words or less",
    }),
  legal: z.string({
    required_error: "Please select type of incorporation",
  }),
  year: z.string({
    required_error: "Please select year of incorporation",
  }),
  sector: z.string({
    required_error: "Please select sector",
  }),
});
export type TAddBusinessExcludingPosition = z.infer<
  typeof AddBusinessSchemaWithoutPosition
>;

export type TAddBusiness = z.infer<typeof AddBusinessSchema>;
