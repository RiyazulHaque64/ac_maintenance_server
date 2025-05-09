"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const validateQueryFields = (fieldsValidationConfig, key, value) => {
    const allowedValues = fieldsValidationConfig[key];
    if (allowedValues && !allowedValues.includes(value))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Invalid value for ${key}. Valid values are ${allowedValues
            .map((i) => `'${i}'`)
            .join(", ")}`);
};
exports.default = validateQueryFields;
