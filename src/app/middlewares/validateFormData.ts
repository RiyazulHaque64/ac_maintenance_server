import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import ApiError from "../error/ApiError";
import httpStatus from "http-status";

const validateFormData = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        const validatedData = await schema.parseAsync({
          body: JSON.parse(req.body.data),
        });
        req.body = validatedData?.body;
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, "Request body is empty");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateFormData;
