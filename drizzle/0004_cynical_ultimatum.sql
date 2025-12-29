CREATE TYPE "public"."enumEventType" AS ENUM('EMAIL_CHANGED', 'PASSWORD_CHANGED', 'EMAIL_CHANGE_REQUESTED');--> statement-breakpoint
CREATE TABLE "user_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"type" "enumEventType" NOT NULL,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_events_user_id_unique" UNIQUE("user_id")
);
