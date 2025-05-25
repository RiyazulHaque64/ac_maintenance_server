"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const fileUploader_1 = require("../../utils/fileUploader");
const File_controllers_1 = require("./File.controllers");
const File_validations_1 = require("./File.validations");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.USER), File_controllers_1.FileControllers.getFiles);
router.post("/upload", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.USER), fileUploader_1.fileUploader.multipleUpload, File_controllers_1.FileControllers.filesUpload);
router.delete("/delete-files", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(File_validations_1.FileValidations.deleteFilesValidationSchema), File_controllers_1.FileControllers.deleteFiles);
exports.FileRoutes = router;
