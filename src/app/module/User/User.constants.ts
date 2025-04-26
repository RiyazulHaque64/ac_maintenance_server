export const userSelectedFields = {
  id: true,
  name: true,
  email: true,
  contact_number: true,
  profile_pic: true,
  status: true,
  role: true,
  created_at: true,
  updated_at: true,
};

export const userSortableFields = [
  "id",
  "name",
  "email",
  "contact_number",
  "created_at",
  "updated_at",
  "role",
  "status",
];

export const userSearchableFields = ["id", "name", "email", "contact_number"];

export const userFilterableFields = [
  "id",
  "name",
  "email",
  "contact_number",
  "searchTerm",
  "limit",
  "page",
  "sortBy",
  "sortOrder",
  "role",
  "status",
];
