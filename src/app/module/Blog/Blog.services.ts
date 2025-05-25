import { Prisma } from "@prisma/client";
import { sortOrderType, uuidRegex } from "../../constants/common";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import { generateSlug } from "../../utils/generateSlug";
import pagination from "../../utils/pagination";
import { userSelectedFields } from "../User/User.constants";
import { blogSearchableFields, blogSortableFields } from "./Blog.constants";
import { IBlog } from "./Blog.interfaces";
import { validDateChecker } from "../../utils/checker";

const createPost = async (user: TAuthUser, data: IBlog) => {
  const tags = data?.tags?.filter((t) => uuidRegex.test(t)) || [];
  if (data.tags && data.tags?.length !== tags?.length) {
    const newTags = data.tags.filter((t) => !uuidRegex.test(t));
    if (newTags.length) {
      await prisma.tag.createMany({
        data: newTags.map((t) => ({ name: t })),
      });
      const addedTags = await prisma.tag.findMany({
        where: {
          name: {
            in: newTags,
          },
        },
      });
      addedTags.forEach((newTag) => tags.push(newTag.id));
    }
  }

  let slug = generateSlug(data.title);
  const isExist = await prisma.blog.findFirst({
    where: {
      slug,
    },
  });
  if (isExist) {
    slug = `${slug}-${Date.now()}`;
  }

  const result = await prisma.blog.create({
    data: {
      ...data,
      slug,
      author_id: user.id,
      tags: {
        connect: tags.map((t) => ({ id: t })),
      },
    },
  });
  return result;
};

const getPosts = async (query: Record<string, any>) => {
  const {
    search_term,
    page,
    limit,
    sort_by,
    sort_order,
    id,
    slug,
    filter_by,
    from_date,
    to_date,
  } = query;

  if (sort_by) {
    fieldValidityChecker(blogSortableFields, sort_by);
  }
  if (sort_order) {
    fieldValidityChecker(sortOrderType, sort_order);
  }

  const { pageNumber, limitNumber, skip, sortWith, sortSequence } = pagination({
    page,
    limit,
    sortBy: sort_by,
    sortOrder: sort_order,
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
      OR: blogSearchableFields.map((field) => ({
        [field]: {
          contains: search_term,
          mode: "insensitive",
        },
      })),
    });
  }

  if (from_date) {
    const date = validDateChecker(from_date, "fromDate");
    andConditions.push({
      created_at: {
        gte: date,
      },
    });
  }

  if (to_date) {
    const date = validDateChecker(to_date, "toDate");
    andConditions.push({
      created_at: {
        lte: date,
      },
    });
  }

  const whereConditons = {
    AND: andConditions,
  };

  const [result, total, published, featured] = await Promise.all([
    prisma.blog.findMany({
      where: whereConditons,
      skip,
      take: limitNumber,
      orderBy: {
        [sortWith]: sortSequence,
      },
      include: {
        author: {
          select: {
            ...userSelectedFields,
          },
        },
        tags: true,
      },
    }),
    prisma.blog.count({ where: whereConditons }),
    prisma.blog.count({ where: { published: true, ...whereConditons } }),
    prisma.blog.count({ where: { featured: true, ...whereConditons } }),
  ]);

  const formattedResult = result.map((item) => ({
    ...item,
    tags: item.tags.map((tag) => tag.name),
  }));

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
    data: formattedResult,
  };
};

const getSinglePost = async (id: string) => {
  const result = await prisma.blog.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      tags: true,
    },
  });
  const formattedResult = {
    ...result,
    tags: result.tags?.map((tag) => tag.id),
  };
  return formattedResult;
};

const updatePost = async (id: string, payload: Record<string, any>) => {
  const { tags: inputTags = [], ...rest } = payload;
  const tags = inputTags?.filter((t: string) => uuidRegex.test(t)) || [];
  if (inputTags?.length !== tags.length) {
    const newTags = inputTags.filter((t: string) => !uuidRegex.test(t));
    if (newTags.length) {
      await prisma.tag.createMany({
        data: newTags.map((t: string) => ({ name: t })),
      });
      const addedTags = await prisma.tag.findMany({
        where: {
          name: {
            in: newTags,
          },
        },
      });
      addedTags.forEach((newTag) => tags.push(newTag.id));
    }
  }
  if (payload.title) {
    let slug = generateSlug(payload.title);
    const isExist = await prisma.blog.findFirst({
      where: {
        slug,
      },
    });
    if (isExist) {
      slug = `${slug}-${Date.now()}`;
    }
    payload.slug = slug;
  }
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: {
      ...rest,
      ...(tags &&
        tags.length > 0 && {
          tags: {
            set: tags.map((tagId: string) => ({ id: tagId })),
          },
        }),
    },
    include: {
      author: {
        select: {
          ...userSelectedFields,
        },
      },
      tags: true,
    },
  });
  return result;
};

const deletePosts = async ({ ids }: { ids: string[] }) => {
  const result = await prisma.blog.deleteMany({
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
};

export const BlogServices = {
  createPost,
  getPosts,
  updatePost,
  deletePosts,
  getSinglePost,
};
