import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { FeatureServices } from "./Feature.services";

const addFeature = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.addFeature(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Feature created successfully",
        data: result,
    });
});

const getFeatures = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.getFeatures(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Features retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const updateFeature = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.updateFeature(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Features updated successfully",
        data: result,
    });
});

const deleteFeatures = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.deleteFeatures(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Features deleted successfully",
        data: result,
    });
});

const addFeatureGroup = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.addFeatureGroup(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Feature group created successfully",
        data: result,
    });
});

const getFeatureGroups = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.getFeatures(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feature groups retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const updateFeatureGroup = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.updateFeatureGroup(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feature group updated successfully",
        data: result,
    });
});

const deleteFeatureGroup = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.deleteFeatureGroup(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feature group deleted successfully",
        data: result,
    });
});

export const FeatureControllers = {
    addFeature,
    getFeatures,
    updateFeature,
    deleteFeatures,
    addFeatureGroup,
    getFeatureGroups,
    updateFeatureGroup,
    deleteFeatureGroup
};