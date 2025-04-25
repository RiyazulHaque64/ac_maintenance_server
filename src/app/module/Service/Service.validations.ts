import { create } from "domain";
import { z } from "zod";

const createServiceValidationSchema = z.object({
  body: z
    .object({
      title: z
        .string({ invalid_type_error: "Title should be a text" })
        .min(1, { message: "Title is required" })
        .max(100, {
          message: "Title must be at most 100 characters long",
        }),
      icon: z.string({ invalid_type_error: "Icon should be a path/url" }),
      short_description: z
        .string({ invalid_type_error: "Short description should be a text" })
        .optional(),
      full_description: z
        .string({ invalid_type_error: "Full description should be a text" })
        .optional(),
    })
    .strict(),
});

const updateServiceValidationSchema = z.object({
  body: z
    .object({
      title: z
        .string({ invalid_type_error: "Title should be a text" })
        .optional(),
      icon: z
        .string({ invalid_type_error: "Icon should be a path/url" })
        .optional(),
      short_description: z
        .string({ invalid_type_error: "Short description should be a text" })
        .optional(),
      full_description: z
        .string({ invalid_type_error: "Full description should be a text" })
        .optional(),
    })
    .strict(),
});

export const ServiceValidations = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
};
