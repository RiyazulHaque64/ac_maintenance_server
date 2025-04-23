"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFieldsValidationConfig = exports.fileSearchableFields = exports.fileSortableFields = exports.allowedFileType = void 0;
const common_1 = require("../../constants/common");
exports.allowedFileType = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/vnd.microsoft.icon",
    "image/webp",
    "image/avif"
];
exports.fileSortableFields = ["name", "created_at", "updated_at"];
exports.fileSearchableFields = ["name", "type"];
exports.fileFieldsValidationConfig = {
    sort_by: exports.fileSortableFields,
    sort_order: common_1.sortOrderType,
    type: exports.allowedFileType
};
