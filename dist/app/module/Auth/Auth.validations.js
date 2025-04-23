"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        first_name: zod_1.z
            .string({ invalid_type_error: "First name should be a text" })
            .min(1, { message: "First name must be at least 1 characters long" })
            .max(100, {
            message: "First name must be at most 100 characters long",
        }),
        last_name: zod_1.z
            .string({ invalid_type_error: "Last name should be a text" })
            .optional(),
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        password: zod_1.z
            .string({
            invalid_type_error: "Password should be a text",
            required_error: "Password is required",
        })
            .min(6, { message: "Password must be at least 6 characters long" })
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
            message: "Password must contain at least one letter and one number",
        }),
        contact_number: zod_1.z
            .string({ invalid_type_error: "Contact number should be a text" })
            .optional(),
        role: zod_1.z.enum(Object.values(client_1.UserRole)).optional(),
    })
        .strict(),
});
const loginUserValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email({ message: "Invalid email address" }),
        password: zod_1.z
            .string({
            invalid_type_error: "Password should be a text",
            required_error: "Password is required",
        })
            .min(1, { message: "Password must be required" }),
    })
        .strict(),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        old_password: zod_1.z
            .string({
            invalid_type_error: "Old password should be a text",
            required_error: "Old password is required",
        })
            .min(1, { message: "Old password must be required" }),
        new_password: zod_1.z
            .string({
            invalid_type_error: "New password should be a text",
            required_error: "New password is required",
        })
            .min(1, { message: "New password must be required" }),
    }),
});
const forgotPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email({ message: "Invalid email address" }),
        otp: zod_1.z
            .number({
            invalid_type_error: "OTP should be a number",
            required_error: "OTP is required",
        })
            .optional(),
        new_password: zod_1.z
            .string({
            invalid_type_error: "Password should be a text",
            required_error: "Password is required",
        })
            .min(6, { message: "Password must be at least 6 characters long" })
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
            message: "Password must contain at least one letter and one number",
        })
            .optional(),
    })
        .strict(),
});
exports.AuthValidations = {
    createUserValidationSchema,
    loginUserValidationSchema,
    resetPasswordValidationSchema,
    forgotPasswordValidationSchema,
};
