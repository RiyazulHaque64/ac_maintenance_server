import { Prisma } from "@prisma/client";
import sharp from "sharp";
import config from "../../config";
import { sortOrderType } from "../../constants/common";
import ApiError from "../../error/ApiError";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import supabase from "../../shared/supabase";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import pagination from "../../utils/pagination";
import { TFile } from "../File/File.interfaces";
import {
  userSearchableFields,
  userSelectedFields,
  userSortableFields,
} from "./User.constants";

const getUsers = async (query: Record<string, any>) => {
  const { searchTerm, page, limit, sortBy, sortOrder, id, ...remainingQuery } =
    query;
  if (sortBy) {
    fieldValidityChecker(userSortableFields, sortBy);
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

  const andConditions: Prisma.UserWhereInput[] = [{ is_deleted: false }];

  if (id)
    andConditions.push({
      id,
    });

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => {
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

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: sortSequence,
    },
    select: {
      ...userSelectedFields,
    },
  });

  const total = await prisma.user.count({ where: whereConditons });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: result,
  };
};

const getMe = async (user: TAuthUser | undefined) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.id,
    },
    select: {
      ...userSelectedFields,
    },
  });

  return result;
};

const updateProfile = async (
  user: TAuthUser,
  payload: Record<string, any>,
  file: TFile | undefined
) => {
  let image: any = {};
  if (file) {
    const userInfo = await prisma.user.findUniqueOrThrow({
      where: {
        id: user?.id,
      },
      select: {
        profile_pic: true,
      },
    });

    if (userInfo.profile_pic) {
      const profile_pic_info = await prisma.file.findFirst({
        where: {
          path: userInfo.profile_pic,
        },
      });
      if (profile_pic_info) {
        const { data, error } = await supabase.storage
          .from(config.supabase_bucket_name)
          .remove([profile_pic_info.path]);
        if (data) {
          await prisma.file.delete({
            where: {
              id: profile_pic_info.id,
            },
          });
        }
      }
    }

    const metadata = await sharp(file.buffer).metadata();

    const fileName = `${Date.now()}_${file.originalname}`;
    const { data } = await supabase.storage
      .from(config.supabase_bucket_name)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (!data?.id) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to upload profile picture"
      );
    }

    image = {
      user_id: user.id,
      name: file.originalname,
      alt_text: file.originalname.replace(/\.[^/.]+$/, ""),
      type: file.mimetype,
      size: file.size,
      width: metadata.width || 0,
      height: metadata.height || 0,
      path: `/${config.supabase_bucket_name}/${data.path}`,
      bucket_id: data.id,
    };
  }

  let profilePic;

  if (image.path && image.bucket_id) {
    profilePic = await prisma.file.create({
      data: image,
    });
  }

  if (profilePic?.id) {
    payload.profile_pic = profilePic.path;
  }

  const result = prisma.user.update({
    where: {
      id: user?.id,
    },
    data: payload,
    select: {
      ...userSelectedFields,
    },
  });

  return result;
};

const updateUser = async (id: string, payload: Record<string, any>) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    select: {
      ...userSelectedFields,
    },
  });
  return result;
};

export const UserServices = {
  updateUser,
  getUsers,
  getMe,
  updateProfile,
};
