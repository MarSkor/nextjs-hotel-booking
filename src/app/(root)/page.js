import React from "react";
import {
  Hero,
  Featured,
  Banner,
  About,
  Stats,
  Testimonials,
} from "@/features/home/components";

const HomePage = () => {
  return (
    <article>
      <Hero />
      <Featured />
      <Banner />
      <About />
      <Stats />
      <Testimonials />
    </article>
  );
};

export default HomePage;
