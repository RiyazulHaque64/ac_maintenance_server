import ApiError from "../error/ApiError";
import httpStatus from "http-status";

export const OTPGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const verifyOTP = async (
  userInputOTP: number,
  storedOTP: number,
  expirationTime: number
) => {
  const currentTime = new Date().getTime();
  if (currentTime > expirationTime) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP has expired");
  }
  if (userInputOTP !== storedOTP) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }
};
