import httpStatus from "http-status";
import ApiError from "../error/ApiError";

const fieldValidityChecker = (fields: string[], data: string) => {
  const isValid = fields.includes(data);
  if (!isValid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${data} is invalid field. Allowed fields are ${fields
        .map((i) => `'${i}'`)
        .join(", ")}`
    );
  }
};

export default fieldValidityChecker;
