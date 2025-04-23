"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureValidations = void 0;
const zod_1 = require("zod");
const addFeatureValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ invalid_type_error: "Name should be a text", required_error: "Name is required" })
            .max(100, {
            message: "Name must be at most 100 characters long",
        }),
        feature_group_id: zod_1.z
            .string({ invalid_type_error: "Id should be a text", required_error: "Feature group id is required" })
            .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid ID"),
    }).strict()
});
const updateFeatureValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ invalid_type_error: "Name should be a text", required_error: "Name is required" })
            .max(100, {
            message: "Name must be at most 100 characters long",
        }).optional(),
        feature_group_id: zod_1.z
            .string({ invalid_type_error: "Id should be a text", required_error: "Feature group id is required" })
            .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid ID").optional(),
    }).strict()
});
const deleteFeaturesValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        ids: zod_1.z
            .array(zod_1.z
            .string({ invalid_type_error: "Id should be a text" })
            .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid ID"))
            .min(1, "Id is required"),
    })
        .strict(),
});
const addFeatureGroupValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ invalid_type_error: "Name should be a text", required_error: "Name is required" })
            .max(100, {
            message: "Name must be at most 100 characters long",
        }),
    }).strict()
});
const updateFeatureGroupValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ invalid_type_error: "Name should be a text", required_error: "Name is required" })
            .max(100, {
            message: "Name must be at most 100 characters long",
        }).optional(),
    }).strict()
});
exports.FeatureValidations = {
    addFeatureValidationSchema,
    deleteFeaturesValidationSchema,
    updateFeatureValidationSchema,
    addFeatureGroupValidationSchema,
    updateFeatureGroupValidationSchema
};
