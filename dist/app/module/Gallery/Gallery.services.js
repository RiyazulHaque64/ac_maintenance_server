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
exports.GalleryServices = void 0;
const common_1 = require("../../constants/common");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fieldValidityChecker_1 = __importDefault(require("../../utils/fieldValidityChecker"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const Gallery_constants_1 = require("./Gallery.constants");
const createGallery = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("data: ", data);
    const result = yield prisma_1.default.gallery.create({
        data,
    });
    return result;
});
const getGalleries = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder, id } = query;
    if (sortBy) {
        (0, fieldValidityChecker_1.default)(Gallery_constants_1.gallerySortableFields, sortBy);
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
    const andConditions = [];
    if (id)
        andConditions.push({
            id,
        });
    if (searchTerm) {
        andConditions.push({
            OR: Gallery_constants_1.gallerySearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    const whereConditions = {
        AND: andConditions,
    };
    const result = yield prisma_1.default.gallery.findMany({
        where: whereConditions,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        },
        include: {
            gallery_items: true,
        },
    });
    const total = yield prisma_1.default.gallery.count({ where: whereConditions });
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
});
const getSingleGallery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.gallery.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            gallery_items: true,
        },
    });
    return result;
});
const updateGallery = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.gallery.update({
        where: {
            id,
        },
        data: Object.assign({}, payload),
    });
    return result;
});
const deleteGalleries = (_a) => __awaiter(void 0, [_a], void 0, function* ({ ids }) {
    const result = yield prisma_1.default.gallery.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    return {
        deleted_count: result.count,
        message: `${result.count} gallery deleted successfully`,
    };
});
const createGalleryItems = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const items = data.file_ids.map((file_id) => ({
        gallery_id: data.gallery_id,
        file_id,
    }));
    const result = yield prisma_1.default.galleryItem.createMany({
        data: items,
    });
    return result;
});
exports.GalleryServices = {
    createGallery,
    getGalleries,
    getSingleGallery,
    updateGallery,
    deleteGalleries,
    createGalleryItems,
};
