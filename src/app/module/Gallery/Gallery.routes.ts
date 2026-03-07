import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { deleteValidationSchema } from "../../schema/common";
import { GalleryControllers } from "./Gallery.controllers";
import { GalleryValidations } from "./Gallery.validations";

const router = Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(GalleryValidations.createGalleryValidationSchema),
  GalleryControllers.createGallery,
);

router.post(
  "/add-items",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(GalleryValidations.createGalleryItemsValidationSchema),
  GalleryControllers.createGalleryItems,
);

router.get("/", GalleryControllers.getGalleries);

router.delete(
  "/delete-galleries",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(deleteValidationSchema),
  GalleryControllers.deleteGallery,
);

router.delete(
  "/delete-items",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(deleteValidationSchema),
  GalleryControllers.deleteGalleryItems,
);

router.get("/:id", GalleryControllers.getSingleGallery);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(GalleryValidations.updateGalleryValidationSchema),
  GalleryControllers.updateGallery,
);

export const GalleryRoutes = router;
