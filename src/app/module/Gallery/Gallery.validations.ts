import { z } from "zod";

const createGalleryValidationSchema = z.object({
  body: z
    .object({
      section: z
        .string({ invalid_type_error: "Section should be a text" })
        .min(1, { message: "Section is required" })
        .max(50, {
          message: "Section must be at most 50 characters long",
        }),
    })
    .strict(),
});

const updateGalleryValidationSchema = z.object({
  body: z
    .object({
      section: z
        .string({ invalid_type_error: "Section should be a text" })
        .min(1, { message: "Section is required" })
        .max(50, {
          message: "Section must be at most 50 characters long",
        })
        .optional(),
    })
    .strict(),
});

export const GalleryValidations = {
  createGalleryValidationSchema,
  updateGalleryValidationSchema,
};
