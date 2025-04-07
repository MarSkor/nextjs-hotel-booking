"use client";
import {
  Container,
  Grid,
  SimpleGrid,
  rem,
  Image,
  Modal,
  Overlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlbum } from "@/components/icons";

const PRIMARY_COL_HEIGHT = rem(360);

const ImageViewDesktop = (props) => {
  const { featured_image, images } = props;
  const [opened, { open, close }] = useDisclosure(false);

  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-sm) / 2)`;

  return (
    <Container my="md" className="container accommodation_desktopview">
      <Modal opened={opened} onClose={close} title="Accommodation Images">
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
      </Modal>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Image
          radius="md"
          h={PRIMARY_COL_HEIGHT}
          alt="accommodation"
          src={featured_image}
        />
        <Grid gutter="md">
          <Grid.Col className="">
            <Image
              radius="md"
              h={SECONDARY_COL_HEIGHT}
              alt="accommodation"
              src={featured_image}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Image
              radius="md"
              h={SECONDARY_COL_HEIGHT}
              alt="accommodation"
              src={featured_image}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <div
              className="accommodation_desktopview__gridwmodal"
              onClick={open}
            >
              <Overlay opacity={0.85} radius="md" />
              <Image
                radius="md"
                h={SECONDARY_COL_HEIGHT}
                alt="accommodation"
                src={featured_image}
              />
              <div>
                <p>+ {images.length} photos</p> <IconAlbum color="#e4e0de" />
              </div>
            </div>
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </Container>
  );
};

export default ImageViewDesktop;
