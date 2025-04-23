import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./Auth.controllers";
import { AuthValidations } from "./Auth.validations";

const router = Router();

router.post(
  "/create-user",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(AuthValidations.createUserValidationSchema),
  AuthControllers.createUser
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginUserValidationSchema),
  AuthControllers.login
);

router.post(
  "/reset-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidations.forgotPasswordValidationSchema),
  AuthControllers.forgotPassword
);

export const AuthRoutes = router;
