import { UserRole } from "@prisma/client";
import config from "../config";
import prisma from "../shared/prisma";
import bcrypt from "bcrypt";

const superAdmin = {
  name: config.super_admin_name,
  email: config.email,
  role: UserRole.SUPER_ADMIN,
};

export const seedSuperAdmin = async () => {
  const isExistSuperAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.SUPER_ADMIN,
    },
  });

  if (!isExistSuperAdmin?.id) {
    const hashedPassword = await bcrypt.hash(
      config.super_admin_password,
      Number(config.salt_rounds)
    );
    await prisma.user.create({
      data: {
        ...superAdmin,
        password: hashedPassword,
      },
    });
  }
};
