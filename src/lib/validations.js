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

export const accommodationSchema = z
  .object({
    title: z.string().trim().min(3).max(150),
    excerpt: z.string().trim().min(10).max(300),
    propertyType: z.string(),
    bodyText: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(2000, "Description cannot exceed 2000 characters")
      .trim()
      .refine((val) => /\s/.test(val), {
        message: "Description must contain at least two words",
      }),
    pricePerNight: z.number().positive().min(1, "Price must be at least $1"),
    guests: z.number().int().positive().max(5),
    queenBeds: z.coerce.number().min(0, "Cannot be negative"),
    fullBeds: z.coerce.number().min(0, "Cannot be negative"),
    twinBeds: z.coerce.number().min(0, "Cannot be negative"),
    amenities: z
      .array(z.string().min(1, "Tag cannot be empty"))
      .min(1, "At least one amenity is required")
      .max(15, "You can add up to 10 amenities"),
    featuredImage: z.any(),
    // imageGallery: z.array(imageSchema).min(1).max(5),
    street: z
      .string()
      .trim()
      .refine(
        (val) => {
          const words = val.trim().split(/\s+/);
          return words.length >= 1 && words.every((w) => w.length >= 1);
        },
        {
          message:
            "Street must contain at least 1 word, each with at least 1 character",
        }
      )
      .regex(/^[a-zA-Z0-9\s.,'-]+$/, "Street name contains invalid characters"),
    buildingNumber: z.number().min(1),
    isFeatured: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const totalBeds = data.queenBeds + data.fullBeds + data.twinBeds;

    if (totalBeds === 0) {
      const message = "At least one queen/full/twin bed must be specified";
      ctx.addIssue({
        code: "custom",
        path: ["queenBeds"],
        message,
      });
      ctx.addIssue({
        code: "custom",
        path: ["fullBeds"],
        message,
      });
      ctx.addIssue({
        code: "custom",
        path: ["twinBeds"],
        message,
      });
    }
  });

export const bookingSchema = z
  .object({
    // checkIn: z.preprocess(
    //   (val) => (typeof val === "string" ? new Date(val) : val),
    //   z.date({ required_error: "Check-in date is required" })
    // ),
    // checkOut: z.preprocess(
    //   (val) => (typeof val === "string" ? new Date(val) : val),
    //   z.date({ required_error: "Check-out date is required" })
    // ),
    checkIn: z.preprocess(
      (val) => (val instanceof Date ? val : val ? new Date(val) : null),
      z
        .date({
          required_error: "Check-in date is required",
          invalid_type_error: "",
        })
        .refine((val) => val !== null, "Check-in date is required")
    ),
    checkOut: z.preprocess(
      (val) => (val instanceof Date ? val : val ? new Date(val) : null),
      z
        .date({ required_error: "Check-out date is required" })
        .refine((val) => val !== null, "Check-out date is required")
    ),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

export const bookingEnquirySchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  name: z
    .string({ required_error: required_error })
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Full name can only contain letters, spaces, hyphens, or apostrophes"
    )
    .trim(),
  phone: z
    .string({ required_error: required_error })
    .trim()
    .max(30, "Phone Number is too long.")
    .regex(/^[0-9+\-()\s]{6,30}$/, {
      message: "Invalid phone number format",
    }),
  message: z
    .string()
    .max(500, "Message is too long.")
    .optional()
    .or(z.literal("")),
});

export const reviewSchema = z.object({
  id: z.uuid().optional(),
  propertyId: z.uuid(),
  guestId: z.uuid(),
  rating: z.number().min(1).max(5),
  comment: z
    .string()
    .min(10, { error: "Comment must be at least 10 characters" }),
  media: z.array(z.url()).optional(),
  createdAt: z.iso.datetime(),
});
