import { Overlay, Text } from "@mantine/core";

const Hero = () => {
  return (
    <section className="hero__wrapper">
      <Overlay color="#000" opacity={0.85} zIndex={1} />
      <div className="hero__inner">
        <div className="hero__title">
          <Text size="md" className="hero__description">
            Housing in Bergen, Norway
          </Text>
          <h1 className="heading-light">
            Elevate your holidays with Holidaze. <br /> Explore, Book, and Relax
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
