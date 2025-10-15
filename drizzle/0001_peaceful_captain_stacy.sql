ALTER TABLE "accommodations" ADD COLUMN "queen_beds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "accommodations" ADD COLUMN "full_beds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "accommodations" ADD COLUMN "twin_beds" integer DEFAULT 0 NOT NULL;