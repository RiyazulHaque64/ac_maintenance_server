import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UtilityControllers } from "./Utility.controllers";
import { UtilityValidations } from "./Utility.validations";

const router = Router();

router.get(
    "/",
    UtilityControllers.getUtilities
);

router.get(
    "/tag",
    UtilityControllers.getTags
);

router.post(
    "/add-tag",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(UtilityValidations.addTagValidationSchema),
    UtilityControllers.addTag
);

router.patch(
    "/tag/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(UtilityValidations.updateTagValidationSchema),
    UtilityControllers.updateTag
);

router.delete(
    "/delete-tags",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(UtilityValidations.deleteTagsValidationSchema),
    UtilityControllers.deleteTags
);

export const UtilityRoutes = router;
