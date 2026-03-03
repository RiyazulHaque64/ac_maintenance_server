import { Prisma } from "@prisma/client";
import { sortOrderType } from "../../constants/common";
import prisma from "../../shared/prisma";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import pagination from "../../utils/pagination";
import {
  gallerySearchableFields,
  gallerySortableFields,
} from "./Gallery.constants";
import { IGallery, IGalleryItem } from "./Gallery.interface";

const createGallery = async (data: IGallery) => {
  console.log("data: ", data);
  const result = await prisma.gallery.create({
    data,
  });
  return result;
};

const getGalleries = async (query: Record<string, any>) => {
  const { searchTerm, page, limit, sortBy, sortOrder, id } = query;

  if (sortBy) {
    fieldValidityChecker(gallerySortableFields, sortBy);
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

  const andConditions: Prisma.GalleryWhereInput[] = [];

  if (id)
    andConditions.push({
      id,
    });

  if (searchTerm) {
    andConditions.push({
      OR: gallerySearchableFields.map((field) => ({
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

  const result = await prisma.gallery.findMany({
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

  const total = await prisma.gallery.count({ where: whereConditions });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: result,
  };
};

const getSingleGallery = async (id: string) => {
  const result = await prisma.gallery.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      gallery_items: true,
    },
  });
  return result;
};

const updateGallery = async (id: string, payload: Record<string, any>) => {
  const result = await prisma.gallery.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

const deleteGalleries = async ({ ids }: { ids: string[] }) => {
  const result = await prisma.gallery.deleteMany({
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
};

const createGalleryItems = async (data: IGalleryItem) => {
  const items = data.file_ids.map((file_id) => ({
    gallery_id: data.gallery_id,
    file_id,
  }));

  const result = await prisma.galleryItem.createMany({
    data: items,
  });
  return result;
};

export const GalleryServices = {
  createGallery,
  getGalleries,
  getSingleGallery,
  updateGallery,
  deleteGalleries,
  createGalleryItems,
};
