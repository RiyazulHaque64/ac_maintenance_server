import { Prisma } from "@prisma/client";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";
import httpStatus from "http-status";

const handlePrismaClientKnownError = (
  error: Prisma.PrismaClientKnownRequestError
): TGenericErrorResponse => {
  let statusCode = 400;
  let message = "Database error";
  let errorSources: TErrorSources[] = [];

  if (error.code === "P2002" && error.meta?.target) {
    statusCode = httpStatus.CONFLICT;
    message = "Unique constraint violation. Duplicate value exists";
    errorSources = (error.meta.target as string[]).map((field: string) => ({
      path: field,
      message: `The ${field} is already exists in the ${error.meta?.modelName}`,
    }));
  } else if (error.code === "P2025") {
    statusCode = httpStatus.NOT_FOUND;
    message = error.message.length < 200 ? error.message : "Data not found";
    errorSources = [
      {
        path: error.meta?.modelName as string,
        message: (error.meta?.cause as string) || error.message,
      },
    ];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaClientKnownError;
