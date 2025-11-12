ALTER TABLE "bookings" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "is_guest" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "email" text NOT NULL;