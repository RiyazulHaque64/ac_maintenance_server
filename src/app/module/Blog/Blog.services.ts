import { Prisma } from "@prisma/client";
import { PREPOSITIONS, sortOrderType, uuidRegex } from "../../constants/common";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import { generateSlug } from "../../utils/generateSlug";
import pagination from "../../utils/pagination";
import { userSelectedFields } from "../User/User.constants";
import { blogSearchableFields, blogSortableFields } from "./Blog.constants";
import { IBlog } from "./Blog.interfaces";
import { validDateChecker } from "../../utils/checker";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";

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
    prisma.blog.count({ where: whereConditons }),
    prisma.blog.count({ where: { published: true, ...whereConditons } }),
    prisma.blog.count({ where: { featured: true, ...whereConditons } }),
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
};

const getSinglePost = async (slug: string) => {
  const result = await prisma.blog.findUniqueOrThrow({
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
};

const updatePost = async (slug: string, payload: Record<string, any>) => {
  // Step 1: Extract `tags` from payload and keep the rest of the blog data
  const { tags: inputTags = [], ...rest } = payload;

  // Step 2: Filter out existing tags (assumed to be UUIDs)
  const existingTagIds = inputTags.filter((t: string) => uuidRegex.test(t));

  // Step 3: Identify new tags that are not UUIDs (names only)
  const newTagNames = inputTags.filter((t: string) => !uuidRegex.test(t));

  // Step 4: Initialize slug (use current or generate from title if needed)
  let generatedSlug = payload.slug;

  // Step 5: If title is provided, generate a new slug and ensure uniqueness
  if (payload.title) {
    generatedSlug = generateSlug(payload.title);

    // Step 5.1: Check if the generated slug already exists
    const isExist = await prisma.blog.findFirst({
      where: { slug: generatedSlug },
    });

    // Step 5.2: If exists, append timestamp to make it unique
    if (isExist) {
      generatedSlug = `${generatedSlug}-${Date.now()}`;
    }
  }

  // Step 6: Run all DB operations inside a transaction
  const result = await prisma.$transaction(async (tx) => {
    let allTagIds = [...existingTagIds];

    // Step 6.1: If there are new tags, create them
    if (newTagNames.length) {
      await tx.tag.createMany({
        data: newTagNames.map((name: string) => ({ name })),
        skipDuplicates: true,
      });

      // Step 6.2: Fetch the newly created tags to get their IDs
      const createdTags = await tx.tag.findMany({
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
    const updatedPost = await tx.blog.update({
      where: { slug },
      data: {
        ...rest,
        slug: generatedSlug,
        ...(allTagIds.length > 0 && {
          tags: {
            set: allTagIds.map((id) => ({ id })),
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

    // Step 6.5: Return the updated blog post
    return updatedPost;
  });

  // Step 7: Return the final result to the caller
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

const getRelatedPosts = async (slug: string) => {
  // Step 1: Get the post with tags
  const post = await prisma.blog.findUniqueOrThrow({
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
    ...new Set(
      post.title
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word && !PREPOSITIONS.has(word))
    ),
  ];

  // Step 2: Find related post by shared tags OR similar title
  const relatedPosts = await prisma.blog.findMany({
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
};

export const BlogServices = {
  createPost,
  getPosts,
  updatePost,
  deletePosts,
  getSinglePost,
  getRelatedPosts,
};
