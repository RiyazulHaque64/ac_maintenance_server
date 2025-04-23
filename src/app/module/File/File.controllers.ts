import { Request } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { FileServices } from "./File.services";

const filesUpload = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await FileServices.filesUpload(req);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Files uploaded successfully",
        data: result,
    });
});

const getFiles = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await FileServices.getFiles(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Files retrieved successfully",
        data: result,
    });
});

const deleteFiles = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await FileServices.deleteFiles(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Files deleted successfully",
        data: result,
    });
});


export const FileControllers = {
    filesUpload,
    getFiles,
    deleteFiles
}