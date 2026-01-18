"use client";
import { useState } from "react";
import {
  Modal,
  Group,
  Button,
  Text,
  Stack,
  Rating,
  Box,
  Title,
  Badge,
  Textarea,
  Divider,
} from "@mantine/core";
import { reviewModeration } from "@/actions/admin";
import { upsertReviewReply } from "@/actions/review";

const ReviewModeration = ({ review }) => {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState(review.reply?.reply || "");

  const statusColors = {
    PENDING: "yellow",
    APPROVED: "green",
    REJECTED: "red",
  };

  const handleAction = async (status) => {
    setLoading(true);
    const res = await reviewModeration(review.id, status);
    console.log("res: ", res);
    setLoading(false);
    if (res.success) setOpened(false);
  };

  const handleReply = async () => {
    setLoading(true);
    await upsertReviewReply(review.id, reply);
    setLoading(false);
  };

  return (
    <>
      <Button variant="light" size="xs" onClick={() => setOpened(true)}>
        Moderate
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Review Moderation"
        centered
        radius="md"
        size={"xl"}
      >
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Stack gap={0}>
              <Text fw={700} size="lg">
                {review.user?.name || "Anonymous"}
              </Text>
              <Text size="sm" c="dimmed">
                Regarding: {review.accommodation?.title}
              </Text>
            </Stack>
            <Badge
              color={statusColors[review.status] || "gray"}
              variant="light"
              size="sm"
            >
              {review.status}
            </Badge>
          </Group>
          <Rating value={Number(review.rating)} readOnly size="md" />

          <Box p="md" bg="gray.0" style={{ borderRadius: "8px" }}>
            <Title mb={"md"} order={3}>
              {review.title}
            </Title>
            <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
              {review.comment}
            </Text>
          </Box>

          <Divider label="Management Response" labelPosition="left" />
          <Textarea
            label="Your Reply"
            placeholder="Thank the guest for their stay..."
            minRows={3}
            value={reply}
            onChange={(e) => setReply(e.currentTarget.value)}
            description="This will be visible publicly once the review is APPROVED."
          />

          <Group justify="space-between" mt="md">
            <Button
              variant="subtle"
              size="xs"
              onClick={handleReply}
              loading={loading}
              disabled={!reply}
            >
              Save Reply Only
            </Button>

            <Group>
              <Button
                variant="outline"
                color="red"
                onClick={() => handleAction("REJECTED")}
              >
                Reject
              </Button>
              <Button color="green" onClick={() => handleAction("APPROVED")}>
                Approve {reply && "& Save Reply"}
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default ReviewModeration;
