import { z } from "zod";

const deleteFilesValidationSchema = z.object({
    body: z.object({
        paths: z.array(z.string({ invalid_type_error: "Path should be a text" })).min(1, { message: "Paths is required" }),
    }).strict()
})

export const FileValidations = {
    deleteFilesValidationSchema
}