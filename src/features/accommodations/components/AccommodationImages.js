"use client";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Box, Skeleton, useMantineTheme } from "@mantine/core";
import { IKImage } from "imagekitio-next";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import config from "@/lib/config";

const AccommodationImages = ({ featuredImage, images = [] }) => {
  const [loadedImages, setLoadedImages] = useState({});

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const handleImage = (i) => {
    setLoadedImages((prev) => ({ ...prev, [i]: true }));
  };

  const placeholderImagePath = "defaults/600x400_DxM717i9q.svg";
  const hasFeaturedImage = !!featuredImage?.filePath;
  const hasImages = Array.isArray(images) && images.length > 0;

  const imageRender = (path, i) => {
    const isPlaceholder = !path || path === placeholderImagePath;
    const imagePath = path || placeholderImagePath;

    return (
      <Box
        key={i}
        className="carousel__slide"
        style={{
          position: "relative",
          width: "100%",
          height: mobile ? 220 : 440,
          overflow: "hidden",
        }}
      >
        {!loadedImages[i] && !isPlaceholder && (
          <Skeleton
            width="100%"
            height={"100%"}
            radius="md"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              opacity: loadedImages[i] ? 0 : 1,
              transition: "opacity 300ms ease",
            }}
          />
        )}

        <IKImage
          alt="Accommodation Cover"
          path={imagePath}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          loading="lazy"
          onLoad={() => handleImage(i)}
          lqip={{ active: true }}
          style={{
            transition: "opacity 0.3s ease",
            objectFit: "cover",
            objectPosition: "center",
            width: "100%",
            height: "100%",
            position: "absolute",
            display: "block",
            inset: 0,
            zIndex: 0,
          }}
          transformation={[
            { width: "1200", height: "800", crop: "maintain_ratio" },
          ]}
        />
      </Box>
    );
  };

  if (!hasImages) {
    const imagePath = hasFeaturedImage
      ? featuredImage.filePath
      : placeholderImagePath;
    return imageRender(imagePath, "featured");
  }

  return (
    <Carousel
      radius="md"
      withIndicators
      emblaOptions={{ loop: true }}
      classNames={{
        root: "details__carousel-root",
        controls: "details__carousel-controls",
        control: "details__carousel-control",
        indicator: "details__carousel-indicator",
      }}
    >
      <CarouselSlide>
        {imageRender(featuredImage?.filePath, "featured")}
      </CarouselSlide>
      {images.map((img, i) => (
        <CarouselSlide key={i}>
          {imageRender(img?.filePath || featuredImage.filePath, i)}
        </CarouselSlide>
      ))}
    </Carousel>
  );
};

export default AccommodationImages;
