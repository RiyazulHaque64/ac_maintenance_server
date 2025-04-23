"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.OTPGenerator = void 0;
const ApiError_1 = __importDefault(require("../error/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const OTPGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.OTPGenerator = OTPGenerator;
const verifyOTP = (userInputOTP, storedOTP, expirationTime) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = new Date().getTime();
    if (currentTime > expirationTime) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "OTP has expired");
    }
    if (userInputOTP !== storedOTP) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid OTP");
    }
});
exports.verifyOTP = verifyOTP;
