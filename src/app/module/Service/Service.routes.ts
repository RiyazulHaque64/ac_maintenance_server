import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ServiceControllers } from "./Service.controllers";
import { deleteValidationSchema } from "../../schema/common";
import { ServiceValidations } from "./Service.validations";

const router = Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(ServiceValidations.createServiceValidationSchema),
  ServiceControllers.createService
);

router.get("/", ServiceControllers.getServices);

router.delete(
  "/delete-services",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(deleteValidationSchema),
  ServiceControllers.deleteService
);

router.get("/:id", ServiceControllers.getSingleService);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(ServiceValidations.updateServiceValidationSchema),
  ServiceControllers.updateService
);

export const ServiceRoutes = router;
