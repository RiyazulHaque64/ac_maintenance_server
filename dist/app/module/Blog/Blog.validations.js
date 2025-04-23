"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidations = void 0;
const zod_1 = require("zod");
const createPostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ invalid_type_error: "Title should be a text" })
            .min(1, { message: "Title is required" })
            .max(100, {
            message: "Title must be at most 100 characters long",
        }),
        content: zod_1.z
            .string({ invalid_type_error: "Content should be a text" })
            .min(1, { message: "Content is required" }),
        tags: zod_1.z.array(zod_1.z
            .string({ invalid_type_error: "Tag should be a text" })).default([]),
        thumbnail: zod_1.z.string({ invalid_type_error: "Thumbnail should be a path/url" }).optional(),
        images: zod_1.z.array(zod_1.z.string({ invalid_type_error: "Image should be a path/url" })).optional(),
    }).strict()
});
const updatePostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ invalid_type_error: "Title should be a text" })
            .min(1, { message: "Title is required" })
            .max(100, {
            message: "Title must be at most 100 characters long",
        }).optional(),
        content: zod_1.z
            .string({ invalid_type_error: "Content should be a text" })
            .min(1, { message: "Content is required" }).optional(),
        tags: zod_1.z.array(zod_1.z
            .string({ invalid_type_error: "Tag should be a text" })).default([]).optional(),
        thumbnail: zod_1.z.string({ invalid_type_error: "Thumbnail should be a path/url" }).optional(),
        images: zod_1.z.array(zod_1.z.string({ invalid_type_error: "Image should be a path/url" })).optional(),
        published: zod_1.z.boolean({ invalid_type_error: "Published should be true or false" }).optional(),
        featured: zod_1.z.boolean({ invalid_type_error: "Featured should be true or false" }).optional()
    }).strict()
});
const deletePostValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        ids: zod_1.z
            .array(zod_1.z
            .string({ invalid_type_error: "Id should be a text" })
            .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid ID"))
            .min(1, "Id is required"),
    })
        .strict(),
});
exports.BlogValidations = {
    createPostValidationSchema,
    updatePostValidationSchema,
    deletePostValidationSchema
};
