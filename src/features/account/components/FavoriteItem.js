"use client";
import { Box, Title, GridCol, Flex, Paper } from "@mantine/core";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";
import Link from "next/link";

const FavoriteItem = (data) => {
  const imagePath = data?.accommodation?.featuredImage?.filePath;

  return (
    <GridCol span={{ base: 12, sm: 6 }}>
      <Paper p={"sm"} withBorder>
        <Flex pos={"relative"} direction={"column"}>
          <Title
            order={3}
            mb={"sm"}
            component={Link}
            href={`/accommodation/${data.accommodation.slug}`}
            style={{
              textDecoration: "none",
              color: "var(--mantine-color-anchor)",
            }}
          >
            {data.accommodation.title}
          </Title>
          <Box pos={"absolute"} style={{ top: 0, right: "10px", zIndex: 20 }}>
            <FavoriteButton
              initialFav={true}
              accommodationId={data.accommodationId}
            />
          </Box>
          <Box pos={"relative"} h={150} w={"100%"}>
            <IKImage
              alt="Accommodation Cover"
              path={imagePath || null}
              urlEndpoint={config.env.imagekit.urlEndpoint}
              loading="lazy"
              lqip={{ active: true }}
              style={{
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
        </Flex>
      </Paper>
    </GridCol>
  );
};

export default FavoriteItem;
