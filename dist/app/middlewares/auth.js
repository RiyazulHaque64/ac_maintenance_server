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
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const jwtHelpers_1 = require("../utils/jwtHelpers");
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const token = req.headers.authorization;
            const token = req.cookies.token;
            if (!token) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
            }
            let verifiedUser;
            try {
                verifiedUser = (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt_access_secret);
            }
            catch (error) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Session expired");
            }
            const user = yield prisma_1.default.user.findUniqueOrThrow({
                where: {
                    id: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id,
                    is_deleted: false,
                    status: client_1.UserStatus.ACTIVE,
                },
            });
            const passwordChangedTime = Math.floor(new Date(user.password_changed_at).getTime() / 1000);
            if (verifiedUser && passwordChangedTime > verifiedUser.iat) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password changed recently");
            }
            if (verifiedUser &&
                (roles === null || roles === void 0 ? void 0 : roles.length) &&
                !roles.includes(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role)) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
            }
            req.user = verifiedUser;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = auth;
