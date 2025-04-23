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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const sharp_1 = __importDefault(require("sharp"));
const config_1 = __importDefault(require("../../config"));
const common_1 = require("../../constants/common");
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const supabase_1 = __importDefault(require("../../shared/supabase"));
const fieldValidityChecker_1 = __importDefault(require("../../utils/fieldValidityChecker"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const User_constants_1 = require("./User.constants");
const getUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder, id } = query, remainingQuery = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder", "id"]);
    if (sortBy) {
        (0, fieldValidityChecker_1.default)(User_constants_1.userSortableFields, sortBy);
    }
    if (sortOrder) {
        (0, fieldValidityChecker_1.default)(common_1.sortOrderType, sortOrder);
    }
    const { pageNumber, limitNumber, skip, sortWith, sortSequence } = (0, pagination_1.default)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const andConditions = [{ is_deleted: false }];
    if (id)
        andConditions.push({
            id,
        });
    if (searchTerm) {
        andConditions.push({
            OR: User_constants_1.userSearchableFields.map((field) => {
                return {
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                };
            }),
        });
    }
    if (Object.keys(remainingQuery).length) {
        Object.keys(remainingQuery).forEach((key) => {
            andConditions.push({
                [key]: remainingQuery[key],
            });
        });
    }
    const whereConditons = {
        AND: andConditions,
    };
    const result = yield prisma_1.default.user.findMany({
        where: whereConditons,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        },
        select: Object.assign({}, User_constants_1.userSelectedFields),
    });
    const total = yield prisma_1.default.user.count({ where: whereConditons });
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
});
const getMe = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
        select: Object.assign({}, User_constants_1.userSelectedFields),
    });
    return result;
});
const updateProfile = (user, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    let image = {};
    if (file) {
        const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            select: {
                profile_pic: true,
            },
        });
        if (userInfo.profile_pic) {
            const profile_pic_info = yield prisma_1.default.file.findFirst({
                where: {
                    path: userInfo.profile_pic,
                },
            });
            if (profile_pic_info) {
                const { data, error } = yield supabase_1.default.storage
                    .from(config_1.default.supabase_bucket_name)
                    .remove([profile_pic_info.path]);
                if (data) {
                    yield prisma_1.default.file.delete({
                        where: {
                            id: profile_pic_info.id,
                        },
                    });
                }
            }
        }
        const metadata = yield (0, sharp_1.default)(file.buffer).metadata();
        const fileName = `${Date.now()}_${file.originalname}`;
        const { data } = yield supabase_1.default.storage
            .from(config_1.default.supabase_bucket_name)
            .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });
        if (!(data === null || data === void 0 ? void 0 : data.id)) {
            throw new ApiError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload profile picture");
        }
        image = {
            user_id: user.id,
            name: file.originalname,
            alt_text: file.originalname.replace(/\.[^/.]+$/, ""),
            type: file.mimetype,
            size: file.size,
            width: metadata.width || 0,
            height: metadata.height || 0,
            path: `/${config_1.default.supabase_bucket_name}/${data.path}`,
            bucket_id: data.id,
        };
    }
    let profilePic;
    if (image.path && image.bucket_id) {
        profilePic = yield prisma_1.default.file.create({
            data: image,
        });
    }
    if (profilePic === null || profilePic === void 0 ? void 0 : profilePic.id) {
        payload.profile_pic = profilePic.path;
    }
    const result = prisma_1.default.user.update({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
        data: payload,
        select: Object.assign({}, User_constants_1.userSelectedFields),
    });
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: payload,
        select: Object.assign({}, User_constants_1.userSelectedFields),
    });
    return result;
});
exports.UserServices = {
    updateUser,
    getUsers,
    getMe,
    updateProfile,
};
