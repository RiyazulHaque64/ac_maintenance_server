import { UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../config";
import ApiError from "../error/ApiError";
import { TAuthUser } from "../interfaces/common";
import prisma from "../shared/prisma";
import { verifyToken } from "../utils/jwtHelpers";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: TAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      let verifiedUser;

      try {
        verifiedUser = verifyToken(token, config.jwt_access_secret);
      } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Session expired");
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: verifiedUser?.id,
          is_deleted: false,
          status: UserStatus.ACTIVE,
        },
      });

      const passwordChangedTime = Math.floor(
        new Date(user.password_changed_at).getTime() / 1000
      );

      if (verifiedUser && passwordChangedTime > verifiedUser.iat) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Password changed recently"
        );
      }

      if (verifiedUser && roles?.length && !roles.includes(verifiedUser?.role)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      req.user = verifiedUser;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
