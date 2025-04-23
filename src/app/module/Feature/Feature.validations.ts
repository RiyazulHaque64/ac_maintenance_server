import { z } from "zod";

const addFeatureValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ invalid_type_error: "Name should be a text", required_error: "Name is required" })
            .max(100, {
                message: "Name must be at most 100 characters long",
            }),
        feature_group_id: z
            .string({ invalid_type_error: "Id should be a text", required_error: "Feature group id is required" })
            .regex(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
                "Invalid ID"
            ),
    }).strict()
});

const updateFeatureValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ invalid_type_error: "Name should be a text", required_error: "Name is required" })
            .max(100, {
                message: "Name must be at most 100 characters long",
            }).optional(),
        feature_group_id: z
            .string({ invalid_type_error: "Id should be a text", required_error: "Feature group id is required" })
            .regex(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
                "Invalid ID"
            ).optional(),
    }).strict()
});

const deleteFeaturesValidationSchema = z.object({
    body: z
        .object({
            ids: z
                .array(
                    z
                        .string({ invalid_type_error: "Id should be a text" })
                        .regex(
                            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
                            "Invalid ID"
                        )
                )
                .min(1, "Id is required"),
        })
        .strict(),
});

const addFeatureGroupValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ invalid_type_error: "Name should be a text", required_error: "Name is required" })
            .max(100, {
                message: "Name must be at most 100 characters long",
            }),
    }).strict()
});

const updateFeatureGroupValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ invalid_type_error: "Name should be a text", required_error: "Name is required" })
            .max(100, {
                message: "Name must be at most 100 characters long",
            }).optional(),
    }).strict()
});

export const FeatureValidations = {
    addFeatureValidationSchema,
    deleteFeaturesValidationSchema,
    updateFeatureValidationSchema,
    addFeatureGroupValidationSchema,
    updateFeatureGroupValidationSchema
}