import { Request } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./Auth.services";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";

const createUser = catchAsync(async (req, res, next) => {
  const result = await AuthServices.createUser(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { token, ...result } = await AuthServices.login(req.body);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      ...result,
    },
  });
});

const resetPassword = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const { token, ...rest } = await AuthServices.resetPassword(
      req.user,
      req.body
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully",
      data: {
        ...rest,
      },
    });
  }
);

const forgotPassword = catchAsync(async (req, res, next) => {
  const result = await AuthServices.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result?.success || false,
    message: result?.message || "Something went wrong",
    data: result?.data,
  });
});

const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

export const AuthControllers = {
  createUser,
  login,
  resetPassword,
  forgotPassword,
  logout,
};
