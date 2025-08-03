import { z } from "zod";

const required_error = "This field is required.";

export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string({ required_error: required_error })
    .min(8, { error: "Password is too short." })
    .trim(),
});

export const registerSchema = z.object({
  fullName: z.string({ required_error: required_error }).min(3).trim(),
  email: z.email({ required_error: "Please enter a valid email." }).trim(),
  password: z
    .string({ required_error: required_error })
    .min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .trim(),
});
