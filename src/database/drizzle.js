import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import config from "@/lib/config";

if (!config.env.databaseUrl) {
  throw new Error("DATABASE_URL must be a Neon postgres connection string");
}
const sql = neon(config.env.databaseUrl);

export const db = drizzle({ client: sql });
