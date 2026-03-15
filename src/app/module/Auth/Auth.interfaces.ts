import { UserRole } from "@prisma/client";
import z from "zod";
import { AuthSchemas } from "./Auth.schemas";

export type LoginPayload = z.infer<typeof AuthSchemas.login>["body"];
export type ResetPasswordPayload = z.infer<
  typeof AuthSchemas.resetPassword
>["body"];
export type ForgotPasswordPayload = z.infer<
  typeof AuthSchemas.forgotPassword
>["body"];
