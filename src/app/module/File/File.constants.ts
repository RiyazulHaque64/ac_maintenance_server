import { sortOrderType } from "../../constants/common";

export const allowedFileType = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/vnd.microsoft.icon",
    "image/webp",
    "image/avif"
];

export const fileSortableFields = ["name", "created_at", "updated_at"];

export const fileSearchableFields = ["name", "type"];

export const fileFieldsValidationConfig = {
    sort_by: fileSortableFields,
    sort_order: sortOrderType,
    type: allowedFileType
}
