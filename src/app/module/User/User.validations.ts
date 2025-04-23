import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const updateProfileValidationSchema = z.object({
  body: z
    .object({
      first_name: z
        .string({ invalid_type_error: "First name should be a text" })
        .min(1, { message: "First name must be at least 1 characters long" })
        .max(100, {
          message: "First name must be at most 100 characters long",
        })
        .optional(),
      last_name: z
        .string({ invalid_type_error: "Last name should be a text" })
        .max(100, { message: "Last name must be at most 100 characters long" })
        .optional(),
      contact_number: z
        .string({ invalid_type_error: "Contact number should be a text" })
        .optional(),
    })
    .strict(),
});

const updateUserValidationSchema = z.object({
  body: z
    .object({
      contact_number: z
        .string({ invalid_type_error: "Contact number should be a text" })
        .optional(),
      role: z.enum(Object.values(UserRole) as [string, ...string[]]).optional(),
      status: z
        .enum(Object.values(UserStatus) as [string, ...string[]])
        .optional(),
      is_deleted: z.boolean().optional(),
    })
    .strict(),
});

export const UserValidations = {
  updateProfileValidationSchema,
  updateUserValidationSchema,
};
