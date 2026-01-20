CREATE TYPE "public"."enumRole" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "public"."enumPropertyType" AS ENUM('guesthouse', 'bed_and_breakfast', 'hotel');--> statement-breakpoint
CREATE TYPE "public"."enumStatus" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."enumEventType" AS ENUM('EMAIL_CHANGED', 'EMAIL_CHANGE_REQUESTED', 'EMAIL_VERIFICATION_RESENT', 'PASSWORD_RESET_REQUESTED', 'PASSWORD_CHANGED', 'PASSWORD_RESET', 'ACCOUNT_DELETED', 'REVIEW_SUBMITTED', 'REVIEW_DELETED', 'BOOKING_CREATED', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'CONTACT_FORM_SUBMITTED', 'ADMIN_BOOKING_CANCELLED', 'ADMIN_PRICE_OVERRIDE', 'ADMIN_USER_BANNED', 'ADMIN_USER_DELETED', 'ADMIN_LISTING_APPROVED', 'ADMIN_REVIEW_APPROVED', 'ADMIN_REVIEW_REJECTED', 'ADMIN_REVIEW_REPLIED', 'ADMIN_RESOURCE_DELETE', 'ADMIN_MESSAGE_READ', 'SYSTEM_SETTING_CHANGED');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('UNREAD', 'READ', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"pending_email" text,
	"email_verified" timestamp,
	"password" text NOT NULL,
	"password_changed_at" timestamp,
	"role" "enumRole" DEFAULT 'USER' NOT NULL,
	"last_activity_date" date DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
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
	"queen_beds" integer DEFAULT 0 NOT NULL,
	"full_beds" integer DEFAULT 0 NOT NULL,
	"twin_beds" integer DEFAULT 0 NOT NULL,
	"amenities" varchar[] NOT NULL,
	"street" varchar(255) NOT NULL,
	"building_number" integer NOT NULL,
	"featured_image" jsonb,
	"images" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"is_available" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"average_rating" numeric(4, 2) DEFAULT '0.00' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "accommodations_slug_unique" UNIQUE("slug"),
	CONSTRAINT "accommodations_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"accommodation_id" uuid NOT NULL,
	"is_guest" boolean DEFAULT false NOT NULL,
	"check_in" timestamp with time zone NOT NULL,
	"check_out" timestamp with time zone NOT NULL,
	"nights" integer NOT NULL,
	"guests" integer DEFAULT 1 NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"status" "enumStatus" DEFAULT 'PENDING' NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" varchar(30),
	"message" text,
	"payment_intent_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"checkout_session_id" text,
	CONSTRAINT "bookings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"accommodation_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"rating" numeric(2, 1) NOT NULL,
	"title" text,
	"comment" text,
	"status" "review_status" DEFAULT 'PENDING',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "reviews_booking_id_unique" UNIQUE("booking_id")
);
--> statement-breakpoint
CREATE TABLE "review_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"owner_id" uuid NOT NULL,
	"reply" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "review_replies_id_unique" UNIQUE("id"),
	CONSTRAINT "review_replies_review_id_unique" UNIQUE("review_id")
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"accommodation_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "favorites_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "email_verifications" (
	"token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"new_email" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_resets" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"pin" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"target_id" uuid,
	"type" "enumEventType" NOT NULL,
	"metadata" jsonb,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" "contact_status" DEFAULT 'UNREAD',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "users" USING btree (lower("email"));