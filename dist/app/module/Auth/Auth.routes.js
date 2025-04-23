"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Auth_controllers_1 = require("./Auth.controllers");
const Auth_validations_1 = require("./Auth.validations");
const router = (0, express_1.Router)();
router.post("/create-user", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Auth_validations_1.AuthValidations.createUserValidationSchema), Auth_controllers_1.AuthControllers.createUser);
router.post("/login", (0, validateRequest_1.default)(Auth_validations_1.AuthValidations.loginUserValidationSchema), Auth_controllers_1.AuthControllers.login);
router.post("/reset-password", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(Auth_validations_1.AuthValidations.resetPasswordValidationSchema), Auth_controllers_1.AuthControllers.resetPassword);
router.post("/forgot-password", (0, validateRequest_1.default)(Auth_validations_1.AuthValidations.forgotPasswordValidationSchema), Auth_controllers_1.AuthControllers.forgotPassword);
exports.AuthRoutes = router;
