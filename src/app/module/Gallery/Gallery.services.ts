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
import ApiError from "../../error/ApiError";

const createGallery = async (data: IGallery) => {
  console.log("data: ", data);
  const result = await prisma.gallery.create({
    data,
  });
  return result;
};

const getGalleries = async (query: Record<string, any>) => {
  const { searchTerm, page, limit, sortBy, sortOrder, id, featured } = query;

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

  if (featured) {
    andConditions.push({
      gallery_items: {
        some: {
          featured: featured === "true",
        },
      },
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
      gallery_items: {
        select: {
          id: true,
          file: true,
          featured: true,
        },
      },
    },
  });

  const total = await prisma.gallery.count({ where: whereConditions });
  const formattedResult = result.map((item) => ({
    ...item,
    gallery_items: item.gallery_items.map((galleryItem) => ({
      id: galleryItem.id,
      file_id: galleryItem.file.id,
      name: galleryItem.file.name,
      path: galleryItem.file.path,
      alt_text: galleryItem.file.alt_text,
      featured: galleryItem.featured,
    })),
  }));

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: formattedResult,
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

const deleteGalleryItems = async ({ ids }: { ids: string[] }) => {
  const result = await prisma.galleryItem.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return {
    deleted_count: result.count,
    message: `${result.count} gallery items deleted successfully`,
  };
};

const updateGalleryItemFeatured = async (id: string) => {
  const item = await prisma.galleryItem.findUnique({
    where: {
      id,
    },
  });

  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Gallery item not found");
  }

  const result = await prisma.galleryItem.update({
    where: {
      id,
    },
    data: {
      featured: !item.featured,
    },
  });
  return result;
};

export const GalleryServices = {
  createGallery,
  getGalleries,
  getSingleGallery,
  updateGallery,
  deleteGalleries,
  deleteGalleryItems,
  createGalleryItems,
  updateGalleryItemFeatured,
};
