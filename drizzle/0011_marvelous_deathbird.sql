ALTER TABLE "accommodations" ALTER COLUMN "featured_image" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "accommodations" ALTER COLUMN "featured_image" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "accommodations" ALTER COLUMN "images" DROP NOT NULL;