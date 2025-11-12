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
    where: (acc, { eq }) => eq(acc.isFeatured, true),
    limit: 3,
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
