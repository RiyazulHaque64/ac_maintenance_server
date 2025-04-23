import { Prisma } from "@prisma/client";
import { sortOrderType } from "../../constants/common";
import prisma from "../../shared/prisma";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import pagination from "../../utils/pagination";


const getUtilities = async () => {
    const tags = await prisma.tag.findMany();
    const featureGroups = await prisma.featureGroup.findMany({
        include: {
            feature: true
        }
    });

    return {
        tags,
        feature_groups: featureGroups
    }
}

const addTag = async (data: { name: string }) => {
    const result = await prisma.tag.create({
        data
    })
    return result;
}

const getTags = async (query: Record<string, any>) => {
    const {
        searchTerm,
        page,
        limit,
        sortBy,
        sortOrder,
        id
    } = query;
    if (sortBy) {
        fieldValidityChecker(["name"], sortBy);
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

    const andConditions: Prisma.TagWhereInput[] = [];

    if (id)
        andConditions.push({
            id,
        });

    if (searchTerm) {
        andConditions.push({
            OR: ["name"].map((field) => ({
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

    const result = await prisma.tag.findMany({
        where: whereConditons,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        }
    });

    const total = await prisma.tag.count({ where: whereConditons });

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
};

const updateTag = async (id: string, payload: { name: string }) => {
    const result = await prisma.tag.update({
        where: {
            id
        },
        data: payload
    })
    return result
}

const deleteTags = async ({ ids }: { ids: string[] }) => {
    const result = await prisma.tag.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    })
    return {
        deleted_count: result.count,
        message: `${result.count} tags deleted successfully`
    }
}

export const UtilityServices = {
    addTag,
    getTags,
    updateTag,
    deleteTags,
    getUtilities
}