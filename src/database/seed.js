import fs from "fs";
import path from "path";
import ImageKit from "imagekit";
import { accommodations } from "./schema/accommodations.js";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql });

const __dirname = path.resolve();
const dummyAccommodations = JSON.parse(
  fs.readFileSync(path.join(__dirname, "dummyAccommodations.json"), "utf-8")
);

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

const uploadToImageKit = async (url, fileName, folder) => {
  try {
    const res = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });
    return res.filePath;
  } catch (error) {
    console.error("Error uploading image to imagekit:", error);
    return url;
  }
};

const seed = async () => {
  console.log("🌱 Seeding data...");

  try {
    for (const acc of dummyAccommodations) {
      const featuredImage = await uploadToImageKit(
        acc.featuredImage,
        `${acc.slug}.jpg`,
        "/accommodations"
      );

      await db.insert(accommodations).values({
        ...acc,
        featuredImage,
      });
    }

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed();
