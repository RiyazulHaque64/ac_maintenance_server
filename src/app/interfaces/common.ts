import { UserRole } from "@prisma/client";

export type TAuthUser = {
  id: string;
  email: string;
  role: UserRole;
  password_changed_at: number;
  iat: number;
  exp: number;
};
