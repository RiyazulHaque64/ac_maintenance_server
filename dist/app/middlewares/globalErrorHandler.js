"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../error/handleZodError"));
const handlePrismaClientKnownError_1 = __importDefault(require("../error/handlePrismaClientKnownError"));
const handlePrismaValidationError_1 = __importDefault(require("../error/handlePrismaValidationError"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = error.message || "Something went wrong";
    let errorSources = [
        {
            path: "",
            message: error.message || "",
        },
    ];
    if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = (0, handlePrismaClientKnownError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        const simplifiedError = (0, handlePrismaValidationError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config_1.default.node_env === "development" ? error.stack : null,
    });
};
exports.default = globalErrorHandler;
