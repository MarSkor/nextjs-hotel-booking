"use client";
import dayjs from "dayjs";
import { useState } from "react";
import {
  Paper,
  Flex,
  Title,
  Text,
  Avatar,
  Rating,
  Box,
  SimpleGrid,
  Container,
  rem,
  Modal,
  Stack,
  Group,
  UnstyledButton,
  ScrollArea,
  Badge,
} from "@mantine/core";

const ReviewCard = ({ onOpenFull, ...data }) => {
  const hasReply = !!data.reply;
  const isCommentLong = data.comment && data.comment.length > 100;
  const isLong = isCommentLong || hasReply;
  const displayName = data.user?.fullName || "Anonymous Guest";
  const isEdited =
    new Date(data.updatedAt).getTime() - new Date(data.createdAt).getTime() >
    60000;

  return (
    <Paper radius={"sm"} p={"md"} key={data.id}>
      <Flex direction={"column"} mb={"sm"}>
        <Flex justify={"space-between"}>
          <Rating
            value={parseFloat(data.rating) || 0}
            fractions={2}
            readOnly
            mb={"xs"}
          />
          <Text size="xs" c="dimmed">
            {dayjs(data.createdAt).format("MMM D, YYYY")}
            {isEdited && (
              <Text
                component="span"
                ml={5}
                fs="italic"
                style={{ fontSize: rem(10) }}
              >
                (Edited)
              </Text>
            )}
          </Text>
        </Flex>
        <Flex align={"center"}>
          <Stack gap={0}>
            <Text
              size="sm"
              fw={600}
              style={{ lineHeight: 1.2 }}
              tt={"capitalize"}
            >
              {displayName}
            </Text>
            <Badge
              mt={"4px"}
              variant="light"
              color="blue"
              size="sm"
              h={rem(14)}
              px={4}
              styles={{
                label: { fontSize: rem(10), textTransform: "capitalize" },
              }}
            >
              Verified Guest
            </Badge>
          </Stack>
        </Flex>
      </Flex>
      <Flex direction={"column"}>
        <Title order={5} mb={"xs"}>
          {data.title}
        </Title>
        <Text size="sm" lineClamp={3} c="gray.7">
          {data.comment}
        </Text>
      </Flex>

      {/* section for admin reply  */}
      {hasReply && !isCommentLong && (
        <Text size="xs" c="blue" fs="italic" mt={5} lineClamp={1}>
          Management Reply: {data.reply.reply}
        </Text>
      )}
      {isLong && (
        <UnstyledButton onClick={onOpenFull} mt={5}>
          <Text
            size="xs"
            c="blue"
            fw={600}
            style={{ textDecoration: "underline" }}
          >
            {hasReply ? "View full review & host response >" : "Show more >"}
          </Text>
        </UnstyledButton>
      )}
    </Paper>
  );
};

const Reviews = ({ reviews }) => {
  const [selectedReview, setSelectedReview] = useState(null);

  if (!reviews || reviews.length === 0) {
    return (
      <Container
        component="section"
        size="lg"
        className="accommodations-details-container"
        mt="xl"
        mb="82px"
      >
        <Box mt="xl" id="details__reviews">
          <Title order={2} mb="md">
            Reviews
          </Title>
          <Text c="dimmed">No reviews yet for this accommodation.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      component="section"
      size="lg"
      className="accommodations-details-container"
      mt="xl"
      mb="82px"
    >
      <Box
        id="details__reviews"
        my={"xl"}
        style={{ scrollMarginTop: rem(100) }}
      >
        <Title order={2} mb="lg">
          Reviews ({reviews.length})
        </Title>
        <SimpleGrid
          spacing={{ base: 10, sm: "lg" }}
          verticalSpacing={{ base: "lg", sm: "lg" }}
          cols={{ base: 1, md: 2 }}
        >
          {reviews.map((review, i) => (
            <ReviewCard
              key={review.id}
              {...review}
              onOpenFull={() => setSelectedReview(review)}
            />
          ))}
        </SimpleGrid>
        <Modal
          opened={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          title="Full Review"
          centered
          size="xl"
          radius="md"
          scrollAreaComponent={ScrollArea.Autosize}
        >
          {selectedReview && (
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Group>
                  <Avatar
                    src={selectedReview.user?.image}
                    size="lg"
                    radius="xl"
                  />
                  <div>
                    <Text fw={600}>
                      {selectedReview.user?.name || "Anonymous Guest"}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Reviewed on{" "}
                      {dayjs(selectedReview.createdAt).format("MMMM D, YYYY")}
                    </Text>
                  </div>
                </Group>
                <Badge color="blue" variant="outline">
                  Verified Stay
                </Badge>
              </Group>

              <Box>
                <Rating
                  value={Number(selectedReview.rating)}
                  readOnly
                  size="lg"
                />
                <Title order={4} mt="sm">
                  {selectedReview.title}
                </Title>
              </Box>

              <Divider label="Review Comment" labelPosition="left" />

              <Text size="md" style={{ whiteSpace: "pre-wrap" }}>
                {selectedReview.comment}
              </Text>
              {/* section for admin reply  */}
              {selectedReview.reply && (
                <Box
                  mt="md"
                  p="md"
                  style={(theme) => ({
                    backgroundColor: theme.colors.blue[0],
                    borderRadius: theme.radius.sm,
                    borderLeft: `${rem(4)} solid ${theme.colors.blue[6]}`,
                  })}
                >
                  <Stack gap={4}>
                    <Group justify="space-between">
                      <Text size="xs" fw={700} c="blue.9" tt="uppercase">
                        Response from Management
                      </Text>
                      <Text size="xs" c="dimmed">
                        {dayjs(selectedReview.reply.createdAt).format(
                          "MMM D, YYYY",
                        )}
                      </Text>
                    </Group>

                    <Text
                      size="sm"
                      fs="italic"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {selectedReview.reply.reply}
                    </Text>
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Modal>
      </Box>
    </Container>
  );
};

const Divider = ({ label }) => (
  <Box
    style={{
      borderBottom: "1px solid #eee",
      position: "relative",
      margin: "10px 0",
    }}
  >
    <Text
      size="xs"
      c="dimmed"
      style={{
        position: "absolute",
        top: -10,
        background: "white",
        paddingRight: 10,
      }}
    >
      {label}
    </Text>
  </Box>
);

export default Reviews;
