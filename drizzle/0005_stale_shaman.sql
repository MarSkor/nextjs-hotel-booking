CREATE TYPE "public"."contact_status" AS ENUM('UNREAD', 'READ', 'ARCHIVED');--> statement-breakpoint
ALTER TYPE "public"."enumEventType" ADD VALUE 'CONTACT_FORM_SUBMITTED' BEFORE 'ADMIN_BOOKING_CANCELLED';--> statement-breakpoint
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
