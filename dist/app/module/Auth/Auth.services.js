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
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const jwtHelpers_1 = require("../../utils/jwtHelpers");
const http_status_1 = __importDefault(require("http-status"));
const User_constants_1 = require("../User/User.constants");
const otp_1 = require("../../utils/otp");
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const createUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const token = req.headers.authorization;
    const hashedPassword = yield bcrypt_1.default.hash(data.password, Number(config_1.default.salt_rounds));
    const new_user = {
        first_name: data.first_name,
        last_name: data.last_name || null,
        email: data.email,
        password: hashedPassword,
        contact_number: data.contact_number || null,
        role: "USER",
    };
    if (token) {
        const verifiedUser = (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt_access_secret);
        if ((verifiedUser.role === "ADMIN" || verifiedUser.role === "SUPER_ADMIN") &&
            data.role) {
            new_user.role = data.role;
        }
    }
    const result = yield prisma_1.default.user.create({
        data: new_user,
        select: Object.assign({}, User_constants_1.userSelectedFields),
    });
    return result;
});
const login = (credential) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = credential;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
            is_deleted: false,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const checkPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!checkPassword) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Email or password is invalid");
    }
    const passwordChangedTime = Math.floor(new Date(user.password_changed_at).getTime() / 1000);
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        password_changed_at: passwordChangedTime,
    };
    const accessToken = (0, jwtHelpers_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        contact_number: user.contact_number,
        profile_pic: user.profile_pic,
        role: user.role,
        token: accessToken,
    };
});
const resetPassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    const checkPassword = yield bcrypt_1.default.compare(payload.old_password, userInfo.password);
    if (!checkPassword) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Old password is invalid");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.new_password, Number(config_1.default.salt_rounds));
    const result = yield prisma_1.default.user.update({
        where: {
            id: userInfo.id,
        },
        data: {
            password: hashedPassword,
            password_changed_at: new Date(),
        },
        select: Object.assign({}, User_constants_1.userSelectedFields),
    });
    return {
        id: result.id,
        name: `${result.first_name} ${result.last_name}`,
        email: result.email,
        contact_number: result.contact_number,
        profile_pic: result.profile_pic,
        role: result.role,
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, new_password, otp } = payload;
    if (new_password && otp) {
        const storedOTP = yield prisma_1.default.oTP.findFirst({
            where: {
                otp: payload.otp,
            },
        });
        if (!storedOTP) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid OTP");
        }
        yield (0, otp_1.verifyOTP)(otp, storedOTP.otp, Number(storedOTP.expires_at));
        const hashedPassword = yield bcrypt_1.default.hash(new_password, Number(config_1.default.salt_rounds));
        const result = yield prisma_1.default.user.update({
            where: {
                email: storedOTP.email,
            },
            data: {
                password: hashedPassword,
            },
            select: Object.assign({}, User_constants_1.userSelectedFields),
        });
        return {
            success: true,
            message: "Password updated successfully",
            data: {
                id: result.id,
                name: `${result.first_name} ${result.last_name}`,
                email: result.email,
                contact_number: result.contact_number,
                profile_pic: result.profile_pic,
                role: result.role,
            },
        };
    }
    else if (email && !new_password && !otp) {
        const user = yield prisma_1.default.user.findUniqueOrThrow({
            where: {
                email: email,
                status: client_1.UserStatus.ACTIVE,
            },
        });
        const generatedOTP = (0, otp_1.OTPGenerator)();
        const expirationTime = (new Date().getTime() + 2 * 60000).toString();
        const emailBody = `<div style="background-color: #f5f5f5; padding: 40px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); display: flex; justify-content: center; align-items: center;">
    <h1>Your OTP is: </h1>
    <p style="font-size: 24px; font-weight: bold; background-color: #007BFF; color: #fff; padding: 10px 20px; border-radius: 5px;">${generatedOTP}</p>
  </div>`;
        const createOTP = yield prisma_1.default.oTP.create({
            data: {
                email: user.email,
                otp: generatedOTP,
                expires_at: expirationTime,
            },
        });
        if (createOTP) {
            const res = yield (0, sendEmail_1.default)(user.email, emailBody);
            if ((res === null || res === void 0 ? void 0 : res.accepted.length) > 0) {
                return {
                    success: true,
                    message: "OTP sent successfully, check your email",
                    data: null,
                };
            }
        }
        else {
            return {
                success: false,
                message: "Failed to send OTP",
                data: null,
            };
        }
    }
});
exports.AuthServices = {
    createUser,
    login,
    resetPassword,
    forgotPassword,
};
