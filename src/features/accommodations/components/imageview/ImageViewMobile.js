// "use client";
import { Image, Paper } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

const ImageViewMobile = (data) => {
  const { images } = data;
  // console.log("mobileview-", images);

  const slides = images.map((image) => (
    <Carousel.Slide key={image}>
      <Image src={image} h={220} alt="accommodation" />
    </Carousel.Slide>
  ));

  return (
    <Paper>
      <Carousel
        slideGap="xs"
        withIndicators
        controlSize={24}
        loop
        classNames={{
          root: "carousel-mobile",
          controls: "carousel-mobile__controls",
          indicator: "carousel-mobile__indicator",
        }}
      >
        {slides}
      </Carousel>
    </Paper>
  );
};

export default ImageViewMobile;
