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
  res.cookie("token", token, { httpOnly: true });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      ...result,
      token,
    },
  });
});

const resetPassword = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await AuthServices.resetPassword(req.user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully",
      data: result,
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

export const AuthControllers = {
  createUser,
  login,
  resetPassword,
  forgotPassword,
};
