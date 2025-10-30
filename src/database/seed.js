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

// const __dirname = path.resolve();
// const dummyAccommodations = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "dummyAccommodations.json"), "utf-8")
// );

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

const uploadToImageKit = async (url, fileName, folder = "/accommodations") => {
  try {
    const res = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });
    console.log(`✅ Uploaded ${fileName} to ImageKit`);
    return {
      fileId: res.fileId,
      filePath: res.filePath,
      url: res.url,
    };
  } catch (error) {
    console.error(`Error uploading ${fileName} to imagekit:`, error);
    return null;
  }
};

const seed = async () => {
  console.log("🌱 Seeding accommodation seed with ImageKit uploads...");

  const filePath = path.join(
    process.cwd(),
    "src",
    "database",
    "dummyAccommodations.json"
  );
  const fileData = fs.readFileSync(filePath, "utf8");
  const dummyAccommodations = JSON.parse(fileData);

  let inserted = 0;

  try {
    for (const acc of dummyAccommodations) {
      let featuredImageData = acc.featuredImage;
      // const featuredImage = await uploadToImageKit(
      //   acc.featuredImage,
      //   `${acc.slug}.jpg`,
      //   "/accommodations"
      // );
      if (!featuredImageData?.fileId && acc.featuredImage) {
        console.log(`⏳ Uploading image for ${acc.title}`);
        const uploaded = await uploadToImageKit(
          acc.featuredImage,
          path.basename(acc.featuredImage)
        );
        if (uploaded) featuredImageData = uploaded;
      }

      const accData = {
        ...acc,
        featuredImage: featuredImageData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.insert(accommodations).values({
        ...accData,
        featuredImage: featuredImageData,
      });
      inserted++;
    }
    console.log("✅ Data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }

  console.log("🌿 Seeding complete!");
  process.exit(0);
};

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
