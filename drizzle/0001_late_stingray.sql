CREATE TABLE "password_resets" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"pin" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
