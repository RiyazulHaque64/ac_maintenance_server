"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handlePrismaClientKnownError = (error) => {
    var _a, _b, _c;
    let statusCode = 400;
    let message = "Database error";
    let errorSources = [];
    if (error.code === "P2002" && ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.target)) {
        statusCode = http_status_1.default.CONFLICT;
        message = "Unique constraint violation. Duplicate value exists";
        errorSources = error.meta.target.map((field) => {
            var _a;
            return ({
                path: field,
                message: `The ${field} is already exists in the ${(_a = error.meta) === null || _a === void 0 ? void 0 : _a.modelName}`,
            });
        });
    }
    else if (error.code === "P2025") {
        statusCode = http_status_1.default.NOT_FOUND;
        message = error.message.length < 200 ? error.message : "Data not found";
        errorSources = [
            {
                path: (_b = error.meta) === null || _b === void 0 ? void 0 : _b.modelName,
                message: ((_c = error.meta) === null || _c === void 0 ? void 0 : _c.cause) || error.message,
            },
        ];
    }
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.default = handlePrismaClientKnownError;
