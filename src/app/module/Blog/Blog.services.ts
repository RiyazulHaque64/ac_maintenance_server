import { Prisma } from "@prisma/client"
import { sortOrderType, uuidRegex } from "../../constants/common"
import { TAuthUser } from "../../interfaces/common"
import prisma from "../../shared/prisma"
import fieldValidityChecker from "../../utils/fieldValidityChecker"
import { generateSlug } from "../../utils/generateSlug"
import pagination from "../../utils/pagination"
import { userSelectedFields } from "../User/User.constants"
import { blogSearchableFields, blogSortableFields } from "./Blog.constants"
import { IBlog } from "./Blog.interfaces"

const createPost = async (user: TAuthUser, data: IBlog) => {
    const tags = data.tags.filter((t) => uuidRegex.test(t));
    if (data.tags.length !== tags.length) {
        const newTags = data.tags.filter((t) => !uuidRegex.test(t));
        if (newTags.length) {
            await prisma.tag.createMany({
                data: newTags.map((t) => ({ name: t }))
            })
            const addedTags = await prisma.tag.findMany({
                where: {
                    name: {
                        in: newTags
                    }
                }
            })
            addedTags.forEach((newTag) => tags.push(newTag.id))
        }
    }

    let slug = generateSlug(data.title)
    const isExist = await prisma.blog.findFirst({
        where: {
            slug
        }
    })
    if (isExist) {
        slug = `${slug}-${Date.now()}`
    }

    const result = await prisma.blog.create({
        data: {
            ...data,
            slug,
            author_id: user.id,
            tags: {
                connect: tags.map((t) => ({ id: t }))
            }
        }
    })
    return result
}


const getPosts = async (query: Record<string, any>) => {
    const {
        searchTerm,
        page,
        limit,
        sortBy,
        sortOrder,
        id,
        slug,
        featured
    } = query;
    if (sortBy) {
        fieldValidityChecker(blogSortableFields, sortBy);
    }
    if (sortOrder) {
        fieldValidityChecker(sortOrderType, sortOrder);
    }

    const { pageNumber, limitNumber, skip, sortWith, sortSequence } = pagination({
        page,
        limit,
        sortBy,
        sortOrder,
    });

    const andConditions: Prisma.BlogWhereInput[] = [];

    if (id)
        andConditions.push({
            id,
        });

    if (slug)
        andConditions.push({
            slug,
        });

    if (featured) {
        andConditions.push({
            featured: Boolean(featured)
        })
    }

    if (searchTerm) {
        andConditions.push({
            OR: blogSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    const whereConditons = {
        AND: andConditions,
    };

    const result = await prisma.blog.findMany({
        where: whereConditons,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        },
        include: {
            author: {
                select: {
                    ...userSelectedFields
                }
            },
            tags: true
        }
    });

    const formattedResult = result.map((item) => ({
        ...item,
        tags: item.tags.map(tag => tag.name)
    }))

    const total = await prisma.blog.count({ where: whereConditons });

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: formattedResult,
    };
};

const getSinglePost = async (id: string) => {
    const result = await prisma.blog.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            tags: true
        }
    })
    const formattedResult = {
        ...result,
        tags: result.tags?.map(tag => tag.id)
    }
    return formattedResult
}

const updatePost = async (id: string, payload: Record<string, any>) => {
    const { tags: inputTags = [], ...rest } = payload
    const tags = inputTags?.filter((t: string) => uuidRegex.test(t)) || [];
    if (inputTags?.length !== tags.length) {
        const newTags = inputTags.filter((t: string) => !uuidRegex.test(t));
        if (newTags.length) {
            await prisma.tag.createMany({
                data: newTags.map((t: string) => ({ name: t }))
            })
            const addedTags = await prisma.tag.findMany({
                where: {
                    name: {
                        in: newTags
                    }
                }
            })
            addedTags.forEach((newTag) => tags.push(newTag.id))
        }
    }
    if (payload.title) {
        let slug = generateSlug(payload.title)
        const isExist = await prisma.blog.findFirst({
            where: {
                slug
            }
        })
        if (isExist) {
            slug = `${slug}-${Date.now()}`
        }
        payload.slug = slug
    }
    const result = await prisma.blog.update({
        where: {
            id,
        },
        data: {
            ...rest,
            ...(tags && tags.length > 0) && {
                tags: {
                    set: tags.map((tagId: string) => ({ id: tagId }))
                }
            },
        },
        include: {
            author: {
                select: {
                    ...userSelectedFields
                }
            },
            tags: true
        }
    });
    return result;
}

const deletePosts = async ({ ids }: { ids: string[] }) => {
    const result = await prisma.blog.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    })
    return {
        deleted_count: result.count,
        message: `${result.count} post deleted successfully`
    }
}

export const BlogServices = {
    createPost,
    getPosts,
    updatePost,
    deletePosts,
    getSinglePost
}