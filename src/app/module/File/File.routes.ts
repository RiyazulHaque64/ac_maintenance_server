import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { fileUploader } from "../../utils/fileUploader";
import { FileControllers } from "./File.controllers";
import { FileValidations } from "./File.validations";

const router = Router();

router.get(
    "/",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
    FileControllers.getFiles
);

router.post(
    "/upload",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
    fileUploader.multipleUpload,
    FileControllers.filesUpload
);

router.delete(
    "/delete-files",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(FileValidations.deleteFilesValidationSchema),
    FileControllers.deleteFiles
);

export const FileRoutes = router;
