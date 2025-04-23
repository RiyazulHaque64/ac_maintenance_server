import { Request } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ServiceServices } from "./Service.services";

const createService = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await ServiceServices.createService(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Service created successfully",
      data: result,
    });
  }
);

const getServices = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await ServiceServices.getServices(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Services retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleService = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await ServiceServices.getSingleService(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service retrieved successfully",
      data: result,
    });
  }
);

const updateService = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await ServiceServices.updateService(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service updated successfully",
      data: result,
    });
  }
);

const deleteService = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await ServiceServices.deleteServices(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service deleted successfully",
      data: result,
    });
  }
);

export const BlogControllers = {
  createService,
  getServices,
  getSingleService,
  updateService,
  deleteService,
};
