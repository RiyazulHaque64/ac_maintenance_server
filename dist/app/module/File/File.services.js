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
exports.FileServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sharp_1 = __importDefault(require("sharp"));
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const supabase_1 = __importDefault(require("../../shared/supabase"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const validateQueryFields_1 = __importDefault(require("../../utils/validateQueryFields"));
const File_constants_1 = require("./File.constants");
const filesUpload = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = req.files;
    const user = req.user;
    if (!((_a = files === null || files === void 0 ? void 0 : files.files) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No file found");
    }
    const prepared_files = [];
    if (files === null || files === void 0 ? void 0 : files.files) {
        for (let i = 0; i < files.files.length; i++) {
            const file = files.files[i];
            if (!File_constants_1.allowedFileType.includes(file.mimetype)) {
                continue;
            }
            const name = `${Date.now()}-${file.originalname}`;
            const metadata = yield (0, sharp_1.default)(file.buffer).metadata();
            const { data } = yield supabase_1.default.storage
                .from('general')
                .upload(name, file.buffer, {
                contentType: file.mimetype,
            });
            if (data === null || data === void 0 ? void 0 : data.id) {
                prepared_files.push({
                    user_id: user.id,
                    name: file.originalname,
                    alt_text: file.originalname.replace(/\.[^/.]+$/, ""),
                    type: file.mimetype,
                    size: file.size,
                    width: metadata.width || 0,
                    height: metadata.height || 0,
                    path: `/general/${data.path}`,
                    bucket_id: data.id,
                });
            }
        }
    }
    const uploaded_files = prepared_files.map((i) => i.path);
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.default.file.createMany({
            data: prepared_files,
            skipDuplicates: true,
        });
        const files = yield prisma_1.default.file.findMany({
            where: {
                path: {
                    in: uploaded_files
                }
            },
            select: {
                name: true,
                path: true
            }
        });
        return files;
    }));
    return result;
});
const getFiles = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder } = query;
    if (sortBy)
        (0, validateQueryFields_1.default)(File_constants_1.fileFieldsValidationConfig, "sort_by", sortBy);
    if (sortOrder)
        (0, validateQueryFields_1.default)(File_constants_1.fileFieldsValidationConfig, "sort_order", sortOrder);
    const { pageNumber, limitNumber, skip, sortWith, sortSequence } = (0, pagination_1.default)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const andConditions = [{ path: { contains: "general" } }];
    if (searchTerm) {
        andConditions.push({
            OR: File_constants_1.fileSearchableFields.map((field) => {
                return {
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                };
            }),
        });
    }
    const whereConditions = {
        AND: andConditions,
    };
    const [result, total] = yield Promise.all([
        prisma_1.default.file.findMany({
            where: whereConditions,
            skip: skip,
            take: limitNumber,
            orderBy: {
                [sortWith]: sortSequence,
            },
            include: {
                uploaded_by: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true
                    },
                },
            },
        }),
        prisma_1.default.file.count({ where: whereConditions }),
    ]);
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
});
const deleteFiles = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { paths } = payload;
    const updatedPaths = paths.map((path) => path.replace("/general/", ""));
    const { data, error } = yield supabase_1.default.storage
        .from('general')
        .remove(updatedPaths);
    if ((error === null || error === void 0 ? void 0 : error.status) === 400 || (data === null || data === void 0 ? void 0 : data.length) === 0)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No valid file path found to delete");
    const deletedFilesBucketId = data === null || data === void 0 ? void 0 : data.map((file) => file.id);
    const result = yield prisma_1.default.file.deleteMany({
        where: {
            bucket_id: {
                in: deletedFilesBucketId,
            },
        },
    });
    return {
        deleted_count: result.count,
        message: `${result.count} files has been deleted`,
    };
});
exports.FileServices = {
    filesUpload,
    getFiles,
    deleteFiles
};
