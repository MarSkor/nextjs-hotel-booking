import {
  Hero,
  Featured,
  Banner,
  About,
  Stats,
  Testimonials,
} from "@/features/home/components";
import { db } from "@/database/drizzle";

const HomePage = async () => {
  const featuredAccommodations = await db.query.accommodations.findMany({
    where: (acc, { eq, and, gte }) =>
      and(eq(acc.isFeatured, true), gte(acc.averageRating, 4)),
    limit: 3,
    orderBy: (acc, { desc }) => [desc(acc.averageRating)],
  });

  return (
    <article>
      <Hero />
      <Featured data={featuredAccommodations} />
      <Banner />
      <About />
      <Stats />
      <Testimonials />
    </article>
  );
};

export default HomePage;
