"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const Gallery_services_1 = require("./Gallery.services");
const createGallery = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Gallery_services_1.GalleryServices.createGallery(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Gallery created successfully",
        data: result,
    });
}));
const getGalleries = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Gallery_services_1.GalleryServices.getGalleries(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Galleries retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleGallery = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Gallery_services_1.GalleryServices.getSingleGallery(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gallery retrieved successfully",
        data: result,
    });
}));
const updateGallery = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Gallery_services_1.GalleryServices.updateGallery(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gallery updated successfully",
        data: result,
    });
}));
const deleteGallery = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Gallery_services_1.GalleryServices.deleteGalleries(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gallery deleted successfully",
        data: result,
    });
}));
const createGalleryItems = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Gallery_services_1.GalleryServices.createGalleryItems(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Gallery items added successfully",
        data: result,
    });
}));
const deleteGalleryItems = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Gallery_services_1.GalleryServices.deleteGalleryItems(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gallery items deleted successfully",
        data: result,
    });
}));
const updateGalleryItemFeatured = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Gallery_services_1.GalleryServices.updateGalleryItemFeatured(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gallery item featured status updated successfully",
        data: result,
    });
}));
exports.GalleryControllers = {
    createGallery,
    getGalleries,
    getSingleGallery,
    updateGallery,
    deleteGallery,
    deleteGalleryItems,
    createGalleryItems,
    updateGalleryItemFeatured,
};
