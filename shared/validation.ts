import { z } from "zod";

export const commonSchemas = {
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  uuid: z.string().uuid("Invalid UUID format"),
  nonEmptyString: z.string().min(1, "This field is required"),
  positiveNumber: z.number().positive("Must be a positive number"),
};

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: string[];
    } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(e => `${e.path.join(".")}: ${e.message}`),
      };
    }
    return { success: false, errors: ["Validation failed"] };
  }
}
