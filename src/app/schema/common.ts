import { z } from "zod";

export const deleteValidationSchema = z.object({
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
