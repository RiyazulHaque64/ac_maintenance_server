import { Request } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PropertyServices } from "./Property.services";

const createProperty = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
  const result = await PropertyServices.createProperty(req.user as TAuthUser, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Property created successfully",
    data: result,
  });
});

const getProperties = catchAsync(async (req, res, next) => {
  const result = await PropertyServices.getProperties(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProperty = catchAsync(async (req, res, next) => {
  const result = await PropertyServices.getSingleProperty(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property retrieved successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req, res, next) => {
  const result = await PropertyServices.updateProperty(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperties = catchAsync(async (req, res, next) => {
  const result = await PropertyServices.deleteProperties(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties deleted successfully",
    data: result,
  });
});

export const PropertyControllers = {
  createProperty,
  getProperties,
  deleteProperties,
  updateProperty,
  getSingleProperty
};
