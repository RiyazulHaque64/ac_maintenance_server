import { z } from "zod";

const addTagValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ invalid_type_error: "Name should be a text", required_error: "Name is required" })
            .max(100, {
                message: "Name must be at most 100 characters long",
            }),
    }).strict()
});

const updateTagValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ invalid_type_error: "Name should be a text", required_error: "Name is required" })
            .max(100, {
                message: "Name must be at most 100 characters long",
            }).optional()
    }).strict()
});

const deleteTagsValidationSchema = z.object({
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

export const UtilityValidations = {
    addTagValidationSchema,
    updateTagValidationSchema,
    deleteTagsValidationSchema
}