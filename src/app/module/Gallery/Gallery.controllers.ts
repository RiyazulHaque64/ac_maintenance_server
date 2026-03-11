import { Request } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { GalleryServices } from "./Gallery.services";

const createGallery = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await GalleryServices.createGallery(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Gallery created successfully",
      data: result,
    });
  },
);

const getGalleries = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await GalleryServices.getGalleries(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Galleries retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const getSingleGallery = catchAsync(async (req, res, next) => {
  const result = await GalleryServices.getSingleGallery(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gallery retrieved successfully",
    data: result,
  });
});

const updateGallery = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await GalleryServices.updateGallery(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gallery updated successfully",
      data: result,
    });
  },
);

const deleteGallery = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await GalleryServices.deleteGalleries(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gallery deleted successfully",
      data: result,
    });
  },
);

const createGalleryItems = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await GalleryServices.createGalleryItems(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Gallery items added successfully",
      data: result,
    });
  },
);

const deleteGalleryItems = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await GalleryServices.deleteGalleryItems(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gallery items deleted successfully",
      data: result,
    });
  },
);

const updateGalleryItemFeatured = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await GalleryServices.updateGalleryItemFeatured(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gallery item featured status updated successfully",
      data: result,
    });
  },
);

export const GalleryControllers = {
  createGallery,
  getGalleries,
  getSingleGallery,
  updateGallery,
  deleteGallery,
  deleteGalleryItems,
  createGalleryItems,
  updateGalleryItemFeatured,
};
