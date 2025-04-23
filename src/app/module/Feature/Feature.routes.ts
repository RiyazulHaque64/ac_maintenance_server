import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { FeatureControllers } from "./Feature.controllers";
import { FeatureValidations } from "./Feature.validations";

const router = Router();

router.get(
    "/",
    FeatureControllers.getFeatures
);

router.get(
    "/feature-groups",
    FeatureControllers.getFeatureGroups
);

router.post(
    "/add-feature",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(FeatureValidations.addFeatureValidationSchema),
    FeatureControllers.addFeature
);

router.post(
    "/add-feature-group",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(FeatureValidations.addFeatureGroupValidationSchema),
    FeatureControllers.addFeatureGroup
);

router.delete(
    "/delete-features",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(FeatureValidations.deleteFeaturesValidationSchema),
    FeatureControllers.deleteFeatures
);

router.delete(
    "/delete-group/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    FeatureControllers.deleteFeatureGroup
);

router.patch(
    "/feature-group/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(FeatureValidations.updateFeatureGroupValidationSchema),
    FeatureControllers.updateFeatureGroup
);

router.patch(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(FeatureValidations.updateFeatureValidationSchema),
    FeatureControllers.updateFeature
);

export const FeatureRoutes = router;
