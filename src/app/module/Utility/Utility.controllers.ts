import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UtilityServices } from "./Utility.services";

const getUtilities = catchAsync(async (req, res, next) => {
    const result = await UtilityServices.getUtilities();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Utilities retrieved successfully",
        data: result,
    });
});

const addTag = catchAsync(async (req, res, next) => {
    const result = await UtilityServices.addTag(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tag created successfully",
        data: result,
    });
});

const getTags = catchAsync(async (req, res, next) => {
    const result = await UtilityServices.getTags(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tags retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const updateTag = catchAsync(async (req, res, next) => {
    const result = await UtilityServices.updateTag(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tag updated successfully",
        data: result,
    });
});

const deleteTags = catchAsync(async (req, res, next) => {
    const result = await UtilityServices.deleteTags(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tags deleted successfully",
        data: result,
    });
});

export const UtilityControllers = {
    addTag,
    getTags,
    updateTag,
    deleteTags,
    getUtilities
}