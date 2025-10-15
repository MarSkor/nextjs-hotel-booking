ALTER TABLE "accommodations" ALTER COLUMN "average_rating" SET DATA TYPE numeric(4, 2);--> statement-breakpoint
ALTER TABLE "accommodations" ALTER COLUMN "average_rating" SET DEFAULT '0.00';