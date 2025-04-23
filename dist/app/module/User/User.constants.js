"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterableFields = exports.userSearchableFields = exports.userSortableFields = exports.userSelectedFields = void 0;
exports.userSelectedFields = {
    id: true,
    first_name: true,
    last_name: true,
    email: true,
    contact_number: true,
    profile_pic: true,
    status: true,
    role: true,
    created_at: true,
    updated_at: true,
};
exports.userSortableFields = [
    "id",
    "first_name",
    "last_name",
    "email",
    "contact_number",
    "created_at",
    "updated_at",
    "role",
    "status",
];
exports.userSearchableFields = [
    "id",
    "first_name",
    "last_name",
    "email",
    "contact_number",
];
exports.userFilterableFields = [
    "id",
    "first_name",
    "last_name",
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
