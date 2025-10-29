ALTER TABLE "accommodations" ALTER COLUMN "featured_image" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "accommodations" ALTER COLUMN "featured_image" SET DEFAULT 'null'::jsonb;