import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PropertyControllers } from "./Property.controllers";
import { PropertyValidations } from "./Property.validations";

const router = Router();

router.get("/", PropertyControllers.getProperties);

router.post(
  "/add-property",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(PropertyValidations.createPropertyValidationSchema),
  PropertyControllers.createProperty
);

router.delete(
  "/delete-properties",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(PropertyValidations.deletePropertyValidationSchema),
  PropertyControllers.deleteProperties
);

router.patch(
  "/update/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(PropertyValidations.updatePropertyValidationSchema),
  PropertyControllers.updateProperty
);

router.get(
  "/:id",
  PropertyControllers.getSingleProperty
);

export const PropertyRoutes = router;
