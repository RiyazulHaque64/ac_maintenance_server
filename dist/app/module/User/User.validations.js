"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        first_name: zod_1.z
            .string({ invalid_type_error: "First name should be a text" })
            .min(1, { message: "First name must be at least 1 characters long" })
            .max(100, {
            message: "First name must be at most 100 characters long",
        })
            .optional(),
        last_name: zod_1.z
            .string({ invalid_type_error: "Last name should be a text" })
            .max(100, { message: "Last name must be at most 100 characters long" })
            .optional(),
        contact_number: zod_1.z
            .string({ invalid_type_error: "Contact number should be a text" })
            .optional(),
    })
        .strict(),
});
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        contact_number: zod_1.z
            .string({ invalid_type_error: "Contact number should be a text" })
            .optional(),
        role: zod_1.z.enum(Object.values(client_1.UserRole)).optional(),
        status: zod_1.z
            .enum(Object.values(client_1.UserStatus))
            .optional(),
        is_deleted: zod_1.z.boolean().optional(),
    })
        .strict(),
});
exports.UserValidations = {
    updateProfileValidationSchema,
    updateUserValidationSchema,
};
