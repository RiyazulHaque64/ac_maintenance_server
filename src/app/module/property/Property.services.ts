import { Prisma } from "@prisma/client";
import { sortOrderType, uuidRegex } from "../../constants/common";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import { generateSlug } from "../../utils/generateSlug";
import pagination from "../../utils/pagination";
import {
  propertySearchableFields,
  propertySelectedFields,
  propertySortableFields,
} from "./Property.constants";
import { IProperty } from "./Property.interfaces";

const createProperty = async (user: TAuthUser, data: IProperty) => {
  const property: any = {
    user_id: user.id,
    title: data.title,
    slug: generateSlug(data.title),
    description: data.description || null,
    feature_image: data.feature_image || null,
    property_type: data.property_type || null,
    price: data.price,
  }

  if (data.status) {
    property.status = data.status
  }
  if (data.images && data.images.length > 0) {
    property.images = data.images
  }
  if (data.tags && data.tags.length > 0) {
    property.tags = data.tags;
  }
  if (data.features && data.features.length > 0) {
    property.features = data.features;
  }
  if (data.property_details) {
    property.property_details = data.property_details
  }
  if (data.location) {
    property.location = data.location
  }

  const contactInfo = await prisma.contactInfo.upsert({
    where: {
      email: data.contact_info.email
    },
    update: {
      name: data.contact_info.name,
      email: data.contact_info.email,
      phone: data.contact_info.phone
    },
    create: {
      name: data.contact_info.name,
      email: data.contact_info.email,
      phone: data.contact_info?.phone || null
    }
  })
  if (contactInfo.id) {
    property.contact_info_id = contactInfo.id
  }

  const tags = data.tags?.filter((t) => uuidRegex.test(t)) || [];
  if (data.tags && data.tags?.length !== tags.length) {
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

  const result = await prisma.property.create({
    data: {
      ...property,
      tags: {
        connect: tags?.map((tagId: string) => ({ id: tagId }))
      },
      features: {
        connect: data.features?.map((featureId: string) => ({ id: featureId }))
      }
    }
  })

  return result;
};

const getProperties = async (query: Record<string, any>) => {
  const {
    searchTerm,
    page,
    limit,
    sortBy,
    sortOrder,
    id,
    slug,
    category,
    feature,
    property
  } = query;

  if (sortBy) {
    fieldValidityChecker(propertySortableFields, sortBy);
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

  const andConditions: Prisma.PropertyWhereInput[] = [];

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
      OR: propertySearchableFields.map((field) => {
        return {
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  if (category && category !== "ALL") {
    const categories = category.split(",");
    const refineCategories = categories.filter((c: string) => c !== "ALL");
    andConditions.push({
      property_type: {
        in: refineCategories,
      },
    });
  }

  if (property && property === 'featured') {
    andConditions.push({
      featured: true
    })
  }

  if (property && property === 'available') {
    andConditions.push({
      status: 'AVAILABLE'
    })
  }

  // if (property && property === 'available') {
  //   andConditions.push({
  //     property_details: {
  //       path: ['available_from'],
  //       lte: new Date()
  //     }
  //   })
  // }

  // if (city && city !== "ALL") {
  //   const cities = city.split(",");
  //   const refineCities = cities.filter((c: string) => c !== "ALL");
  //   andConditions.push({
  //     location: {
  //       OR: refineCities.map((city: string) => ({
  //         city: {
  //           contains: city,
  //           mode: "insensitive",
  //         },
  //       })),
  //     },
  //   });
  // }

  const whereConditons = {
    AND: andConditions,
  };

  if (feature) {
    const features = feature.split(",");
    andConditions.push({
      features: {
        some: {
          name: {
            in: features
          }
        }
      }
    })
  }

  const result = await prisma.property.findMany({
    where: whereConditons,
    skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: sortSequence,
    },
    select: {
      ...propertySelectedFields,
    },
  });

  const formattedResult = result.map((item) => ({
    ...item,
    tags: item.tags.map(tag => tag.name),
    features: item.features.reduce((acc: any, feature: any) => {
      const group = acc.find((g: any) => g.group_name === feature.feature_group.name);
      if (group) {
        group.features.push(feature.name);
      } else {
        acc.push({
          group_name: feature.feature_group.name,
          features: [feature.name]
        });
      }
      return acc;
    }, []),
  }))

  const total = await prisma.property.count({ where: whereConditons });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: formattedResult,
  };
};

const getSingleProperty = async (id: string) => {
  const result = await prisma.property.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      tags: true,
      features: true,
      contact_info: true
    }
  })
  const formattedResult = {
    ...result,
    tags: result.tags?.map(tag => tag.id)
  }
  return formattedResult
}

const updateProperty = async (id: string, payload: Record<string, any>) => {
  const { contact_info, tags: inputTags, features, created_at, updated_at, ...rest } = payload;
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      contact_info: true
    }
  })

  if (contact_info?.email && contact_info?.email !== property.contact_info?.email) {
    const contactInfo = await prisma.contactInfo.upsert({
      where: {
        email: payload.contact_info.email
      },
      update: {
        name: payload.contact_info.name,
        email: payload.contact_info.email,
        phone: payload.contact_info.phone
      },
      create: {
        name: payload.contact_info.name,
        email: payload.contact_info.email,
        phone: payload.contact_info?.phone || null
      }
    })
    if (contactInfo.id) {
      payload.contact_info_id = contactInfo.id
    }
  }

  if (payload.title && payload.title !== property.title) {
    payload.slug = generateSlug(payload.title)
  }

  const tags = inputTags?.filter((t: string) => uuidRegex.test(t)) || [];
  if (inputTags && inputTags?.length !== tags.length) {
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

  const result = await prisma.property.update({
    where: {
      id
    },
    data: {
      ...rest,
      ...(tags && tags.length > 0) && {
        tags: {
          set: tags.map((tagId: string) => ({ id: tagId }))
        }
      },
      ...(features && features.length > 0) && {
        features: {
          set: features.map((featureId: string) => ({ id: featureId }))
        }
      }
    }
  })

  return result
}

const deleteProperties = async ({ ids }: { ids: string[] }) => {
  const result = await prisma.property.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
  return {
    deleted_count: result.count,
    message: `${result.count} property deleted successfully`
  }
}

export const PropertyServices = {
  createProperty,
  getProperties,
  deleteProperties,
  updateProperty,
  getSingleProperty
};
