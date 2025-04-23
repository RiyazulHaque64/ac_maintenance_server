import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { UserControllers } from "./User.controllers";
import { fileUploader } from "../../utils/fileUploader";
import validateFormData from "../../middlewares/validateFormData";
import { UserValidations } from "./User.validations";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.getUsers
);

router.get(
  "/profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  UserControllers.getMe
);

router.patch(
  "/update-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  fileUploader.singleUpload.single("profile_pic"),
  validateFormData(UserValidations.updateProfileValidationSchema),
  UserControllers.updateProfile
);

router.patch(
  "/update-user/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUser
);

export const UserRoutes = router;
