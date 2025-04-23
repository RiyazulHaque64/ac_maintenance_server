import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BlogControllers } from "./Blog.controllers";
import { BlogValidations } from "./Blog.validations";

const router = Router();

router.post(
    "/post",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(BlogValidations.createPostValidationSchema),
    BlogControllers.createPost
);

router.get(
    "/posts",
    BlogControllers.getPosts
);

router.patch(
    "/post/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(BlogValidations.updatePostValidationSchema),
    BlogControllers.updatePost
);

router.delete(
    "/delete-posts",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(BlogValidations.deletePostValidationSchema),
    BlogControllers.deletePosts
);

router.get(
    "/post/:id",
    BlogControllers.getSinglePost
);

export const BlogRoutes = router;
