import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./Auth.controllers";
import { UserRole } from "../../../generated/prisma/enums";
import { AuthSchemas } from "./Auth.schemas";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthSchemas.login),
  AuthControllers.login,
);

router.post(
  "/reset-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  validateRequest(AuthSchemas.resetPassword),
  AuthControllers.resetPassword,
);

router.post(
  "/forgot-password",
  validateRequest(AuthSchemas.forgotPassword),
  AuthControllers.forgotPassword,
);

router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;
