import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { sortOrderType } from "../../constants/common";
import ApiError from "../../error/ApiError";
import prisma from "../../shared/prisma";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import pagination from "../../utils/pagination";
import { featureGroupSearchableFields, featureGroupSortableFields, featureSearchableFields, featureSortableFields } from "./Feature.constants";
import { IFeature } from "./Feature.interfaces";

const addFeature = async (data: IFeature) => {
    const result = await prisma.feature.create({
        data
    })
    return result;
}

const getFeatures = async (query: Record<string, any>) => {
    const {
        searchTerm,
        page,
        limit,
        sortBy,
        sortOrder,
        id
    } = query;
    if (sortBy) {
        fieldValidityChecker(featureSortableFields, sortBy);
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

    const andConditions: Prisma.FeatureWhereInput[] = [];

    if (id)
        andConditions.push({
            id,
        });

    if (searchTerm) {
        andConditions.push({
            OR: featureSearchableFields.map((field) => ({
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

    const result = await prisma.feature.findMany({
        where: whereConditons,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        }
    });

    const total = await prisma.feature.count({ where: whereConditons });

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
};

const updateFeature = async (id: string, payload: IFeature) => {
    const result = await prisma.feature.update({
        where: {
            id
        },
        data: payload
    })
    return result
}

const deleteFeatures = async ({ ids }: { ids: string[] }) => {
    const result = await prisma.feature.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    })
    return {
        deleted_count: result.count,
        message: `${result.count} feature deleted successfully`
    }
}

const addFeatureGroup = async (data: { name: string }) => {
    console.log(data);
    const result = await prisma.featureGroup.create({
        data
    })
    return result
}

const getFeatureGroups = async (query: Record<string, any>) => {
    const {
        searchTerm,
        page,
        limit,
        sortBy,
        sortOrder,
        id
    } = query;
    if (sortBy) {
        fieldValidityChecker(featureGroupSortableFields, sortBy);
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

    const andConditions: Prisma.FeatureGroupWhereInput[] = [];

    if (id)
        andConditions.push({
            id,
        });

    if (searchTerm) {
        andConditions.push({
            OR: featureGroupSearchableFields.map((field) => ({
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

    const result = await prisma.featureGroup.findMany({
        where: whereConditons,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        },
        include: {
            feature: true
        }
    });

    const total = await prisma.featureGroup.count({ where: whereConditons });

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
};

const updateFeatureGroup = async (id: string, payload: { name: string }) => {
    console.log({ id, payload });
    const result = await prisma.featureGroup.update({
        where: {
            id
        },
        data: payload
    })
    return result
}

const deleteFeatureGroup = async (id: string) => {
    const result = await prisma.$transaction(async (tx) => {
        await tx.feature.deleteMany({
            where: {
                feature_group_id: id
            }
        })
        const res = await tx.featureGroup.delete({
            where: {
                id
            }
        })
        return res;
    })

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete feature group")
    }

    return null
}

export const FeatureServices = { addFeature, getFeatures, updateFeature, deleteFeatures, addFeatureGroup, getFeatureGroups, updateFeatureGroup, deleteFeatureGroup };