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
    <>
      <Hero />
      <Featured />
      <Banner />
      <About />
      <Stats />
      <Testimonials />
    </>
  );
};

export default HomePage;
