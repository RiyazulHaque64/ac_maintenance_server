"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileValidations = void 0;
const zod_1 = require("zod");
const deleteFilesValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        paths: zod_1.z.array(zod_1.z.string({ invalid_type_error: "Path should be a text" })).min(1, { message: "Paths is required" }),
    }).strict()
});
exports.FileValidations = {
    deleteFilesValidationSchema
};
