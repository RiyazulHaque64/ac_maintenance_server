"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterableFields = exports.userSearchableFields = exports.userSortableFields = exports.userSelectedFields = void 0;
exports.userSelectedFields = {
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
exports.userSortableFields = [
    "id",
    "name",
    "email",
    "contact_number",
    "created_at",
    "updated_at",
    "role",
    "status",
];
exports.userSearchableFields = ["id", "name", "email", "contact_number"];
exports.userFilterableFields = [
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
