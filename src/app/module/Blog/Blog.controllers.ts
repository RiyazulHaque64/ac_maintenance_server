import { Request } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { BlogServices } from "./Blog.services";

const createPost = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await BlogServices.createPost(req.user as TAuthUser, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Post created successfully",
        data: result,
    });
});

const getPosts = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await BlogServices.getPosts(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Posts retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getSinglePost = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await BlogServices.getSinglePost(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post retrieved successfully",
        data: result,
    });
});

const updatePost = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await BlogServices.updatePost(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Posts updated successfully",
        data: result,
    });
});

const deletePosts = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await BlogServices.deletePosts(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Posts deleted successfully",
        data: result,
    });
});

export const BlogControllers = {
    createPost,
    getPosts,
    updatePost,
    deletePosts,
    getSinglePost
}