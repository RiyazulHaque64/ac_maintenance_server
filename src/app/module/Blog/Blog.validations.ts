import { z } from "zod";

const createPostValidationSchema = z.object({
    body: z.object({
        title: z
            .string({ invalid_type_error: "Title should be a text" })
            .min(1, { message: "Title is required" })
            .max(100, {
                message: "Title must be at most 100 characters long",
            }),
        content: z
            .string({ invalid_type_error: "Content should be a text" })
            .min(1, { message: "Content is required" }),
        tags: z.array(z
            .string({ invalid_type_error: "Tag should be a text" })).default([]),
        thumbnail: z.string({ invalid_type_error: "Thumbnail should be a path/url" }).optional(),
        images: z.array(z.string({ invalid_type_error: "Image should be a path/url" })).optional(),
    }).strict()
});

const updatePostValidationSchema = z.object({
    body: z.object({
        title: z
            .string({ invalid_type_error: "Title should be a text" })
            .min(1, { message: "Title is required" })
            .max(100, {
                message: "Title must be at most 100 characters long",
            }).optional(),
        content: z
            .string({ invalid_type_error: "Content should be a text" })
            .min(1, { message: "Content is required" }).optional(),
        tags: z.array(z
            .string({ invalid_type_error: "Tag should be a text" })).default([]).optional(),
        thumbnail: z.string({ invalid_type_error: "Thumbnail should be a path/url" }).optional(),
        images: z.array(z.string({ invalid_type_error: "Image should be a path/url" })).optional(),
        published: z.boolean({ invalid_type_error: "Published should be true or false" }).optional(),
        featured: z.boolean({ invalid_type_error: "Featured should be true or false" }).optional()
    }).strict()
});

const deletePostValidationSchema = z.object({
    body: z
        .object({
            ids: z
                .array(
                    z
                        .string({ invalid_type_error: "Id should be a text" })
                        .regex(
                            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
                            "Invalid ID"
                        )
                )
                .min(1, "Id is required"),
        })
        .strict(),
});

export const BlogValidations = {
    createPostValidationSchema,
    updatePostValidationSchema,
    deletePostValidationSchema
}