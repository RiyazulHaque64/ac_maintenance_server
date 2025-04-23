"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Blog_controllers_1 = require("./Blog.controllers");
const Blog_validations_1 = require("./Blog.validations");
const router = (0, express_1.Router)();
router.post("/post", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Blog_validations_1.BlogValidations.createPostValidationSchema), Blog_controllers_1.BlogControllers.createPost);
router.get("/posts", Blog_controllers_1.BlogControllers.getPosts);
router.patch("/post/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Blog_validations_1.BlogValidations.updatePostValidationSchema), Blog_controllers_1.BlogControllers.updatePost);
router.delete("/delete-posts", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Blog_validations_1.BlogValidations.deletePostValidationSchema), Blog_controllers_1.BlogControllers.deletePosts);
router.get("/post/:id", Blog_controllers_1.BlogControllers.getSinglePost);
exports.BlogRoutes = router;
