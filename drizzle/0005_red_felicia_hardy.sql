ALTER TABLE "bookings" ADD COLUMN "nights" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "checkout_session_id" text;