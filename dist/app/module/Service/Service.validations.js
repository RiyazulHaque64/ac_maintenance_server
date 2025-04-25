"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceValidations = void 0;
const zod_1 = require("zod");
const createServiceValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z
            .string({ invalid_type_error: "Title should be a text" })
            .min(1, { message: "Title is required" })
            .max(100, {
            message: "Title must be at most 100 characters long",
        }),
        icon: zod_1.z.string({ invalid_type_error: "Icon should be a path/url" }),
        short_description: zod_1.z
            .string({ invalid_type_error: "Short description should be a text" })
            .optional(),
        full_description: zod_1.z
            .string({ invalid_type_error: "Full description should be a text" })
            .optional(),
    })
        .strict(),
});
const updateServiceValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z
            .string({ invalid_type_error: "Title should be a text" })
            .optional(),
        icon: zod_1.z
            .string({ invalid_type_error: "Icon should be a path/url" })
            .optional(),
        short_description: zod_1.z
            .string({ invalid_type_error: "Short description should be a text" })
            .optional(),
        full_description: zod_1.z
            .string({ invalid_type_error: "Full description should be a text" })
            .optional(),
    })
        .strict(),
});
exports.ServiceValidations = {
    createServiceValidationSchema,
    updateServiceValidationSchema,
};
