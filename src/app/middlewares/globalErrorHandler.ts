import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import config from "../config";
import { ZodError } from "zod";
import handleZodError from "../error/handleZodError";
import { TErrorSources } from "../interfaces/error";
import handlePrismaClientKnownError from "../error/handlePrismaClientKnownError";
import handlePrismaValidationError from "../error/handlePrismaValidationError";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || "Something went wrong";
  let errorSources: TErrorSources[] = [
    {
      path: "",
      message: error.message || "",
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handlePrismaValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === "development" ? error.stack : null,
  });
};

export default globalErrorHandler;
