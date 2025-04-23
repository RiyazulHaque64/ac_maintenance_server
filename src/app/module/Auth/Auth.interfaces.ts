import { UserRole } from "@prisma/client";

export type TCreateUserPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  contact_number: string;
  role?: "USER" | "ADMIN";
};

export type TNewUser = {
  first_name: string;
  last_name: string | null;
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
