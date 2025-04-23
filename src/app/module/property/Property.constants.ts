export const propertySortableFields = [
  "title",
  "price",
  "created_at",
  "updated_at",
  "status",
  "property_type",
];

export const propertySearchableFields = ["title", "description"];

export const propertyFilterableFields = [
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "searchTerm",
  "id",
  "slug",
  "property_type",
  "status",
];

export const propertySelectedFields = {
  id: true,
  title: true,
  slug: true,
  description: true,
  price: true,
  feature_image: true,
  images: true,
  property_type: true,
  status: true,
  tags: {
    select: {
      name: true
    }
  },
  documents: true,
  property_details: true,
  features: {
    select: {
      name: true,
      feature_group: {
        select: {
          name: true
        }
      }
    }
  },
  contact_info: true,
  location: true,
  created_at: true,
  updated_at: true,
  uploaded_by: {
    select: {
      first_name: true,
      last_name: true,
      email: true,
      contact_number: true,
      profile_pic: true,
      role: true,
    },
  },
  featured: true
};
