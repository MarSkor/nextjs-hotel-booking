ALTER TABLE "accommodations" ALTER COLUMN "images" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "accommodations" ALTER COLUMN "images" SET DEFAULT '[]'::jsonb;