import { UserRole } from "@prisma/client";

export type TCreateUserPayload = {
  name: string;
  email: string;
  password: string;
  contact_number: string;
  role?: "USER" | "ADMIN";
};

export type TNewUser = {
  name: string;
  email: string;
  password: string;
  contact_number: string | null;
  role: UserRole;
};

export type TLoginCredential = {
  email: string;
  password: string;
};

export type TResetPasswordPayload = {
  old_password: string;
  new_password: string;
};

export type TForgotPasswordPayload = {
  email: string;
  new_password?: string;
  otp?: number;
};
