import { Request } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../utils/pick";
import { userFilterableFields } from "./User.constants";
import { UserServices } from "./User.services";

const getUsers = catchAsync(async (req, res, next) => {
  const filteredQuery = pick(req.query, userFilterableFields);
  const result = await UserServices.getUsers(filteredQuery);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMe = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await UserServices.getMe(req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your profile retrieved successfully",
      data: result,
    });
  }
);

const updateProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await UserServices.updateProfile(
      req.user as TAuthUser,
      req.body,
      req.file
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your profile updated successfully",
      data: result,
    });
  }
);

const updateUser = catchAsync(async (req, res, next) => {
  const result = await UserServices.updateUser(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const UserControllers = {
  getUsers,
  getMe,
  updateProfile,
  updateUser,
};
