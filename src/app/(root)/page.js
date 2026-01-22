import {
  Hero,
  Featured,
  Banner,
  About,
  Stats,
  Reviews,
} from "@/features/home/components";
import { db } from "@/database/drizzle";
import { reviews } from "@/database/schema";
import { desc, eq } from "drizzle-orm";

const HomePage = async () => {
  const [reviewsData, featuredAccs] = await Promise.all([
    db.query.reviews.findMany({
      where: eq(reviews.status, "APPROVED"),
      limit: 12,
      orderBy: [desc(reviews.createdAt)],
      with: { user: true, accommodation: true },
    }),
    db.query.accommodations.findMany({
      where: (acc, { eq, and, or, gte }) =>
        and(
          eq(acc.isFeatured, true),
          or(gte(acc.averageRating, "4.00"), eq(acc.averageRating, "0.00")),
        ),
      limit: 3,
    }),
  ]);

  return (
    <>
      <Hero />
      <Featured data={featuredAccs} />
      <Banner />
      <About />
      <Stats />
      <Reviews data={reviewsData} />
    </>
  );
};

export default HomePage;
