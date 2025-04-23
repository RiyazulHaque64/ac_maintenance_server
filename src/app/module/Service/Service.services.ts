import { Prisma } from "@prisma/client";
import { sortOrderType } from "../../constants/common";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import { generateSlug } from "../../utils/generateSlug";
import pagination from "../../utils/pagination";
import {
  serviceSearchableFields,
  serviceSortableFields,
} from "./Service.constants";
import { IService } from "./Service.interface";

const createService = async (data: IService) => {
  let slug = generateSlug(data.title);
  const isExist = await prisma.service.findFirst({
    where: {
      slug,
    },
  });
  if (isExist) {
    slug = `${slug}-${Date.now()}`;
  }

  const result = await prisma.service.create({
    data: {
      ...data,
      slug,
    },
  });
  return result;
};

const getServices = async (query: Record<string, any>) => {
  const { searchTerm, page, limit, sortBy, sortOrder, id, slug } = query;
  if (sortBy) {
    fieldValidityChecker(serviceSortableFields, sortBy);
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

  const andConditions: Prisma.ServiceWhereInput[] = [];

  if (id)
    andConditions.push({
      id,
    });

  if (slug)
    andConditions.push({
      slug,
    });

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map((field) => ({
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

  const result = await prisma.service.findMany({
    where: whereConditons,
    skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: sortSequence,
    },
  });

  const total = await prisma.service.count({ where: whereConditons });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: result,
  };
};

const getSingleService = async (id: string) => {
  const result = await prisma.service.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const updateService = async (id: string, payload: Record<string, any>) => {
  if (payload.title) {
    let slug = generateSlug(payload.title);
    const isExist = await prisma.service.findFirst({
      where: {
        slug,
      },
    });
    if (isExist) {
      slug = `${slug}-${Date.now()}`;
    }
    payload.slug = slug;
  }
  const result = await prisma.service.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

const deleteServices = async ({ ids }: { ids: string[] }) => {
  const result = await prisma.service.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return {
    deleted_count: result.count,
    message: `${result.count} service deleted successfully`,
  };
};

export const ServiceServices = {
  createService,
  getServices,
  getSingleService,
  updateService,
  deleteServices,
};
