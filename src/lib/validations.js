import { z } from "zod";

const required_error = "This field is required.";

export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  password: z
    .string({ required_error: required_error })
    .min(1, { error: "Please enter your password." })
    .trim(),
});

export const registerSchema = z.object({
  fullName: z
    .string({ required_error: required_error })
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Full name can only contain letters, spaces, hyphens, or apostrophes"
    )
    .trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string({ required_error: required_error })
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, {
      error: "Password must contain at least one letter.",
    })
    .regex(/[0-9]/, {
      error: "Password must contain at least one number.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Password must contain at least one special character.",
    })
    .trim(),
});
