ALTER TABLE "user_events" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."enumEventType";--> statement-breakpoint
CREATE TYPE "public"."enumEventType" AS ENUM('EMAIL_CHANGED', 'EMAIL_CHANGE_REQUESTED', 'PASSWORD_RESET_REQUESTED', 'PASSWORD_CHANGED');--> statement-breakpoint
ALTER TABLE "user_events" ALTER COLUMN "type" SET DATA TYPE "public"."enumEventType" USING "type"::"public"."enumEventType";