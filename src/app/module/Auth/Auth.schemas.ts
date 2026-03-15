import { z } from "zod";

const loginUserValidationSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),
      password: z
        .string({
          invalid_type_error: "Password should be a text",
          required_error: "Password is required",
        })
        .min(1, { message: "Password must be required" }),
    })
    .strict(),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    old_password: z
      .string({
        invalid_type_error: "Old password should be a text",
        required_error: "Old password is required",
      })
      .min(1, { message: "Old password must be required" }),
    new_password: z
      .string({
        invalid_type_error: "New password should be a text",
        required_error: "New password is required",
      })
      .min(1, { message: "New password must be required" }),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),
      otp: z
        .number({
          invalid_type_error: "OTP should be a number",
          required_error: "OTP is required",
        })
        .optional(),
      new_password: z
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

export const AuthValidations = {
  loginUserValidationSchema,
  resetPasswordValidationSchema,
  forgotPasswordValidationSchema,
};
