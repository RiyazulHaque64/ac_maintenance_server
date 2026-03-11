"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryValidations = void 0;
const zod_1 = require("zod");
const createGalleryValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        section: zod_1.z
            .string({ invalid_type_error: "Section should be a text" })
            .min(1, { message: "Section is required" })
            .max(50, {
            message: "Section must be at most 50 characters long",
        }),
    })
        .strict(),
});
const updateGalleryValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        section: zod_1.z
            .string({ invalid_type_error: "Section should be a text" })
            .min(1, { message: "Section is required" })
            .max(50, {
            message: "Section must be at most 50 characters long",
        })
            .optional(),
    })
        .strict(),
});
const createGalleryItemsValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        gallery_id: zod_1.z
            .string({ invalid_type_error: "Gallery ID should be a text" })
            .uuid({ message: "Invalid gallery ID" }),
        file_ids: zod_1.z
            .array(zod_1.z
            .string({ invalid_type_error: "File ID should be a text" })
            .uuid({ message: "Invalid file ID" }))
            .min(1, { message: "File IDs are required" }),
    })
        .strict(),
});
const updateGalleryItemFeaturedValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        featured: zod_1.z.boolean({
            invalid_type_error: "Featured must be a boolean",
        }),
    })
        .strict(),
});
exports.GalleryValidations = {
    createGalleryValidationSchema,
    updateGalleryValidationSchema,
    createGalleryItemsValidationSchema,
    updateGalleryItemFeaturedValidationSchema,
};
