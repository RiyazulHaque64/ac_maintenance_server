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
const ApiError_1 = __importDefault(require("../error/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const validateFormData = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.body.data) {
                const validatedData = yield schema.parseAsync({
                    body: JSON.parse(req.body.data),
                });
                req.body = validatedData === null || validatedData === void 0 ? void 0 : validatedData.body;
            }
            else {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Request body is empty");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = validateFormData;
