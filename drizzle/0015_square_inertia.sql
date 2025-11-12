ALTER TABLE "bookings" ADD COLUMN "is_guest" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "guest_name" text NOT NULL;