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
exports.BlogServices = void 0;
const common_1 = require("../../constants/common");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fieldValidityChecker_1 = __importDefault(require("../../utils/fieldValidityChecker"));
const generateSlug_1 = require("../../utils/generateSlug");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const User_constants_1 = require("../User/User.constants");
const Blog_constants_1 = require("./Blog.constants");
const checker_1 = require("../../utils/checker");
const createPost = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const tags = ((_a = data === null || data === void 0 ? void 0 : data.tags) === null || _a === void 0 ? void 0 : _a.filter((t) => common_1.uuidRegex.test(t))) || [];
    if (data.tags && ((_b = data.tags) === null || _b === void 0 ? void 0 : _b.length) !== (tags === null || tags === void 0 ? void 0 : tags.length)) {
        const newTags = data.tags.filter((t) => !common_1.uuidRegex.test(t));
        if (newTags.length) {
            yield prisma_1.default.tag.createMany({
                data: newTags.map((t) => ({ name: t })),
            });
            const addedTags = yield prisma_1.default.tag.findMany({
                where: {
                    name: {
                        in: newTags,
                    },
                },
            });
            addedTags.forEach((newTag) => tags.push(newTag.id));
        }
    }
    let slug = (0, generateSlug_1.generateSlug)(data.title);
    const isExist = yield prisma_1.default.blog.findFirst({
        where: {
            slug,
        },
    });
    if (isExist) {
        slug = `${slug}-${Date.now()}`;
    }
    const result = yield prisma_1.default.blog.create({
        data: Object.assign(Object.assign({}, data), { slug, author_id: user.id, tags: {
                connect: tags.map((t) => ({ id: t })),
            } }),
    });
    return result;
});
const getPosts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search_term, page, limit, sort_by, sort_order, id, slug, filter_by, from_date, to_date, } = query;
    if (sort_by) {
        (0, fieldValidityChecker_1.default)(Blog_constants_1.blogSortableFields, sort_by);
    }
    if (sort_order) {
        (0, fieldValidityChecker_1.default)(common_1.sortOrderType, sort_order);
    }
    const { pageNumber, limitNumber, skip, sortWith, sortSequence } = (0, pagination_1.default)({
        page,
        limit,
        sortBy: sort_by,
        sortOrder: sort_order,
    });
    const andConditions = [];
    if (id)
        andConditions.push({
            id,
        });
    if (slug)
        andConditions.push({
            slug,
        });
    if (filter_by) {
        switch (filter_by) {
            case "published":
                andConditions.push({
                    published: true,
                });
                break;
            case "draft":
                andConditions.push({
                    published: false,
                });
                break;
            case "featured":
                andConditions.push({
                    featured: true,
                });
                break;
            case "unfeatured":
                andConditions.push({
                    featured: false,
                });
                break;
            default:
                break;
        }
    }
    if (search_term) {
        andConditions.push({
            OR: Blog_constants_1.blogSearchableFields.map((field) => ({
                [field]: {
                    contains: search_term,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (from_date) {
        const date = (0, checker_1.validDateChecker)(from_date, "fromDate");
        andConditions.push({
            created_at: {
                gte: date,
            },
        });
    }
    if (to_date) {
        const date = (0, checker_1.validDateChecker)(to_date, "toDate");
        andConditions.push({
            created_at: {
                lte: date,
            },
        });
    }
    const whereConditons = {
        AND: andConditions,
    };
    const [result, total, published, featured] = yield Promise.all([
        prisma_1.default.blog.findMany({
            where: whereConditons,
            skip,
            take: limitNumber,
            orderBy: {
                [sortWith]: sortSequence,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        contact_number: true,
                        profile_pic: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
        prisma_1.default.blog.count({ where: whereConditons }),
        prisma_1.default.blog.count({ where: Object.assign({ published: true }, whereConditons) }),
        prisma_1.default.blog.count({ where: Object.assign({ featured: true }, whereConditons) }),
    ]);
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            stats: {
                published: published,
                draft: total - published,
                featured: featured,
                unfeatured: total - featured,
            },
        },
        data: result,
    };
});
const getSinglePost = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findUniqueOrThrow({
        where: {
            slug,
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact_number: true,
                    profile_pic: true,
                },
            },
            tags: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return result;
});
const updatePost = (slug, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Extract `tags` from payload and keep the rest of the blog data
    const { tags: inputTags = [] } = payload, rest = __rest(payload, ["tags"]);
    // Step 2: Filter out existing tags (assumed to be UUIDs)
    const existingTagIds = inputTags.filter((t) => common_1.uuidRegex.test(t));
    // Step 3: Identify new tags that are not UUIDs (names only)
    const newTagNames = inputTags.filter((t) => !common_1.uuidRegex.test(t));
    // Step 4: Initialize slug (use current or generate from title if needed)
    let generatedSlug = payload.slug;
    // Step 5: If title is provided, generate a new slug and ensure uniqueness
    if (payload.title) {
        generatedSlug = (0, generateSlug_1.generateSlug)(payload.title);
        // Step 5.1: Check if the generated slug already exists
        const isExist = yield prisma_1.default.blog.findFirst({
            where: { slug: generatedSlug },
        });
        // Step 5.2: If exists, append timestamp to make it unique
        if (isExist) {
            generatedSlug = `${generatedSlug}-${Date.now()}`;
        }
    }
    // Step 6: Run all DB operations inside a transaction
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        let allTagIds = [...existingTagIds];
        // Step 6.1: If there are new tags, create them
        if (newTagNames.length) {
            yield tx.tag.createMany({
                data: newTagNames.map((name) => ({ name })),
                skipDuplicates: true,
            });
            // Step 6.2: Fetch the newly created tags to get their IDs
            const createdTags = yield tx.tag.findMany({
                where: {
                    name: {
                        in: newTagNames,
                    },
                },
            });
            // Step 6.3: Add newly created tag IDs to the full tag list
            allTagIds = [...allTagIds, ...createdTags.map((tag) => tag.id)];
        }
        // Step 6.4: Update the blog post with new data and tags
        const updatedPost = yield tx.blog.update({
            where: { slug },
            data: Object.assign(Object.assign(Object.assign({}, rest), { slug: generatedSlug }), (allTagIds.length > 0 && {
                tags: {
                    set: allTagIds.map((id) => ({ id })),
                },
            })),
            include: {
                author: {
                    select: Object.assign({}, User_constants_1.userSelectedFields),
                },
                tags: true,
            },
        });
        // Step 6.5: Return the updated blog post
        return updatedPost;
    }));
    // Step 7: Return the final result to the caller
    return result;
});
const deletePosts = (_a) => __awaiter(void 0, [_a], void 0, function* ({ ids }) {
    const result = yield prisma_1.default.blog.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    return {
        deleted_count: result.count,
        message: `${result.count} post deleted successfully`,
    };
});
const getRelatedPosts = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Get the post with tags
    const post = yield prisma_1.default.blog.findUniqueOrThrow({
        where: {
            slug,
        },
        include: {
            tags: {
                select: {
                    id: true,
                },
            },
        },
    });
    const tagIds = post.tags.map((tag) => tag.id);
    const keywords = [
        ...new Set(post.title
            .toLowerCase()
            .split(/\s+/)
            .filter((word) => word && !common_1.PREPOSITIONS.has(word))),
    ];
    // Step 2: Find related post by shared tags OR similar title
    const relatedPosts = yield prisma_1.default.blog.findMany({
        where: {
            id: { not: post.id },
            published: true,
            OR: [
                {
                    tags: {
                        some: {
                            id: { in: tagIds },
                        },
                    },
                },
                {
                    OR: keywords.map((word) => ({
                        title: {
                            contains: word,
                            mode: "insensitive",
                        },
                    })),
                },
            ],
        },
        take: 10,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact_number: true,
                    profile_pic: true,
                },
            },
            tags: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return relatedPosts;
});
exports.BlogServices = {
    createPost,
    getPosts,
    updatePost,
    deletePosts,
    getSinglePost,
    getRelatedPosts,
};
