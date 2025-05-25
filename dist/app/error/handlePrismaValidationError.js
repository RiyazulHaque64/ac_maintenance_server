"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlePrismaValidationError = (error) => {
    const statusCode = 400;
    const message = "Database validation error";
    const errorSources = [
        {
            path: "Database",
            message: "Perhaps you are missing some required fields",
        },
    ];
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.default = handlePrismaValidationError;
