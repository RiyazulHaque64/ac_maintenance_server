"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Utility_controllers_1 = require("./Utility.controllers");
const Utility_validations_1 = require("./Utility.validations");
const router = (0, express_1.Router)();
router.get("/", Utility_controllers_1.UtilityControllers.getUtilities);
router.get("/tag", Utility_controllers_1.UtilityControllers.getTags);
router.post("/add-tag", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Utility_validations_1.UtilityValidations.addTagValidationSchema), Utility_controllers_1.UtilityControllers.addTag);
router.patch("/tag/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Utility_validations_1.UtilityValidations.updateTagValidationSchema), Utility_controllers_1.UtilityControllers.updateTag);
router.delete("/delete-tags", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Utility_validations_1.UtilityValidations.deleteTagsValidationSchema), Utility_controllers_1.UtilityControllers.deleteTags);
exports.UtilityRoutes = router;
