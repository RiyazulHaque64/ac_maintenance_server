import { UserRole, UserStatus } from "@prisma/client";
import config from "../../config";
import prisma from "../../shared/prisma";
import {
  TCreateUserPayload,
  TForgotPasswordPayload,
  TLoginCredential,
  TNewUser,
  TResetPasswordPayload,
} from "./Auth.interfaces";
import bcrypt from "bcrypt";
import ApiError from "../../error/ApiError";
import { generateToken, verifyToken } from "../../utils/jwtHelpers";
import { TAuthUser } from "../../interfaces/common";
import httpStatus from "http-status";
import { userSelectedFields } from "../User/User.constants";
import { OTPGenerator, verifyOTP } from "../../utils/otp";
import sendEmail from "../../utils/sendEmail";
import { Request } from "express";

const createUser = async (req: Request) => {
  const data: TCreateUserPayload = req.body;
  const token = req.headers.authorization;

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.salt_rounds)
  );

  const new_user: TNewUser = {
    first_name: data.first_name,
    last_name: data.last_name || null,
    email: data.email,
    password: hashedPassword,
    contact_number: data.contact_number || null,
    role: "USER",
  };

  if (token) {
    const verifiedUser = verifyToken(token, config.jwt_access_secret);
    if (
      (verifiedUser.role === "ADMIN" || verifiedUser.role === "SUPER_ADMIN") &&
      data.role
    ) {
      new_user.role = data.role;
    }
  }

  const result = await prisma.user.create({
    data: new_user,
    select: {
      ...userSelectedFields,
    },
  });

  return result;
};

const login = async (credential: TLoginCredential) => {
  const { email, password } = credential;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
      is_deleted: false,
      status: UserStatus.ACTIVE,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw new ApiError(httpStatus.FORBIDDEN, "Email or password is invalid");
  }

  const passwordChangedTime = Math.floor(
    new Date(user.password_changed_at).getTime() / 1000
  );

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    password_changed_at: passwordChangedTime,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    contact_number: user.contact_number,
    profile_pic: user.profile_pic,
    role: user.role,
    token: accessToken,
  };
};

const resetPassword = async (
  user: TAuthUser | undefined,
  payload: TResetPasswordPayload
) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.id,
    },
  });

  const checkPassword = await bcrypt.compare(
    payload.old_password,
    userInfo.password
  );
  if (!checkPassword) {
    throw new ApiError(httpStatus.FORBIDDEN, "Old password is invalid");
  }
  const hashedPassword = await bcrypt.hash(
    payload.new_password,
    Number(config.salt_rounds)
  );
  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: {
      password: hashedPassword,
      password_changed_at: new Date(),
    },
    select: {
      ...userSelectedFields,
    },
  });

  return {
    id: result.id,
    name: `${result.first_name} ${result.last_name}`,
    email: result.email,
    contact_number: result.contact_number,
    profile_pic: result.profile_pic,
    role: result.role,
  };
};

const forgotPassword = async (payload: TForgotPasswordPayload) => {
  const { email, new_password, otp } = payload;
  if (new_password && otp) {
    const storedOTP = await prisma.oTP.findFirst({
      where: {
        otp: payload.otp,
      },
    });

    if (!storedOTP) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
    }

    await verifyOTP(otp, storedOTP.otp, Number(storedOTP.expires_at));

    const hashedPassword = await bcrypt.hash(
      new_password,
      Number(config.salt_rounds)
    );

    const result = await prisma.user.update({
      where: {
        email: storedOTP.email,
      },
      data: {
        password: hashedPassword,
      },
      select: {
        ...userSelectedFields,
      },
    });

    return {
      success: true,
      message: "Password updated successfully",
      data: {
        id: result.id,
        name: `${result.first_name} ${result.last_name}`,
        email: result.email,
        contact_number: result.contact_number,
        profile_pic: result.profile_pic,
        role: result.role,
      },
    };
  } else if (email && !new_password && !otp) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: email,
        status: UserStatus.ACTIVE,
      },
    });

    const generatedOTP = OTPGenerator();
    const expirationTime = (new Date().getTime() + 2 * 60000).toString();

    const emailBody = `<div style="background-color: #f5f5f5; padding: 40px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); display: flex; justify-content: center; align-items: center;">
    <h1>Your OTP is: </h1>
    <p style="font-size: 24px; font-weight: bold; background-color: #007BFF; color: #fff; padding: 10px 20px; border-radius: 5px;">${generatedOTP}</p>
  </div>`;

    const createOTP = await prisma.oTP.create({
      data: {
        email: user.email,
        otp: generatedOTP,
        expires_at: expirationTime,
      },
    });

    if (createOTP) {
      const res = await sendEmail(user.email, emailBody);
      if (res?.accepted.length > 0) {
        return {
          success: true,
          message: "OTP sent successfully, check your email",
          data: null,
        };
      }
    } else {
      return {
        success: false,
        message: "Failed to send OTP",
        data: null,
      };
    }
  }
};

export const AuthServices = {
  createUser,
  login,
  resetPassword,
  forgotPassword,
};
