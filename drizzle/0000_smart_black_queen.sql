CREATE TYPE "public"."enumPropertyType" AS ENUM('guesthouse', 'bed_and_breakfast', 'hotel');--> statement-breakpoint
CREATE TYPE "public"."enumStatus" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."enumRole" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TABLE "accommodations" (
	"slug" varchar(255) DEFAULT 'temp-slug' NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"property_type" "enumPropertyType" NOT NULL,
	"excerpt" varchar(255) NOT NULL,
	"body_text" text NOT NULL,
	"price_per_night" integer DEFAULT 1 NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"guests" integer DEFAULT 1 NOT NULL,
	"amenities" varchar[] NOT NULL,
	"street" varchar(255) NOT NULL,
	"building_number" integer NOT NULL,
	"featured_image" text NOT NULL,
	"images" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"is_available" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"average_rating" numeric(3, 2) DEFAULT 0 NOT NULL,
	CONSTRAINT "accommodations_slug_unique" UNIQUE("slug"),
	CONSTRAINT "accommodations_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"accommodation_id" uuid NOT NULL,
	"check_in" timestamp with time zone NOT NULL,
	"check_out" timestamp with time zone NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"status" "enumStatus" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "bookings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"accommodation_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "reviews_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "enumRole" DEFAULT 'USER' NOT NULL,
	"last_activity_date" date DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE cascade ON UPDATE no action;