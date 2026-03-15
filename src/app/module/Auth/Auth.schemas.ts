import { z } from "zod";

// ------------------------------------- LOGIN -------------------------------------
const login = z.object({
  body: z
    .object({
      email: z.email({ message: "Invalid email" }),
      password: z
        .string({
          error: "Password should be a text",
        })
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
          message: "Password must contain at least one letter and one number",
        }),
    })
    .strict(),
});

// ------------------------------------- RESET PASSWORD ----------------------------
const resetPassword = z.object({
  body: z.object({
    old_password: z
      .string({
        error: "Old password should be a text",
      })
      .min(1, { message: "Old password must be required" }),
    new_password: z
      .string({
        error: "New password should be a text",
      })
      .min(1, { message: "New password must be required" }),
  }),
});

// ------------------------------------- FORGOT PASSWORD ---------------------------
const forgotPassword = z.object({
  body: z
    .object({
      email: z.email({ message: "Invalid email" }),
      otp: z
        .number({
          error: "OTP should be a number",
        })
        .optional(),
      new_password: z
        .string({
          error: "Password should be a text",
        })
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
          message: "Password must contain at least one letter and one number",
        })
        .optional(),
    })
    .strict(),
});

export const AuthSchemas = {
  login,
  resetPassword,
  forgotPassword,
};
