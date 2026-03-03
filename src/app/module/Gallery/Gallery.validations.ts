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

const createGalleryItemsValidationSchema = z.object({
  body: z
    .object({
      gallery_id: z
        .string({ invalid_type_error: "Gallery ID should be a text" })
        .uuid({ message: "Invalid gallery ID" }),
      file_ids: z
        .array(
          z
            .string({ invalid_type_error: "File ID should be a text" })
            .uuid({ message: "Invalid file ID" }),
        )
        .min(1, { message: "File IDs are required" }),
    })
    .strict(),
});

export const GalleryValidations = {
  createGalleryValidationSchema,
  updateGalleryValidationSchema,
  createGalleryItemsValidationSchema,
};
