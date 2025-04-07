import {
  Hero,
  Featured,
  Banner,
  AboutUs,
  Stats,
  Testimonials,
} from "@/features/home/components";
import { BookingSearchField } from "@/features/accommodations/forms";

export default function Home() {
  return (
    <>
      <Hero />
      <BookingSearchField position="absolute" />
      <Featured />
      <Banner />
      <AboutUs />
      <Stats />
      <Testimonials />
    </>
  );
}
