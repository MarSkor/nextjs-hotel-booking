"use client";
import { useForm } from "react-hook-form";
import {
  Button,
  Modal,
  Rating,
  Textarea,
  Stack,
  Text,
  TextInput,
  Flex,
  ButtonGroup,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { deleteReview, submitReview } from "@/actions/review";
import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema } from "@/lib/validations";

const ReviewForm = ({
  bookingId,
  accommodationId,
  accommodationTitle,
  initialData,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const MAX_COMMENT_LENGTH = 1000;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: initialData?.title || "",
      rating: initialData ? parseFloat(initialData.rating) : 0,
      comment: initialData?.comment || "",
    },
    criteriaMode: "all",
  });

  const commentValue = watch("comment") || "";

  useEffect(() => {
    reset({
      title: initialData?.title || "",
      rating: initialData ? parseFloat(initialData.rating) : 0,
      comment: initialData?.comment || "",
    });
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    const res = await submitReview({ ...data, bookingId, accommodationId });
    if (res.success) {
      notifications.show({
        title: initialData ? "Review updated" : "Review submitted",
        message: "Your feedback is being processed.",
        color: "green",
      });
      close();
    } else {
      notifications.show({
        title: "Error",
        message: res.error || "Failed to save review",
        color: "red",
      });
    }
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Delete your review",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this review? This will remove your
          rating from the accommodation's average score.
        </Text>
      ),
      labels: { confirm: "Delete permanently", cancel: "No, keep it" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        setIsDeleting(true);
        const res = await deleteReview(initialData.id);
        setIsDeleting(false);
        if (res.success) {
          notifications.show({
            title: "Review deleted",
            message: "Your review has been removed.",
            color: "red",
          });
          reset({ title: "", rating: 0, comment: "" });
          close();
        } else {
          notifications.show({
            title: "Delete Failed",
            message: res.error || "Could not delete review.",
            color: "red",
          });
        }
      },
    });
  };

  return (
    <>
      <Button
        variant="light"
        size="sm"
        color={initialData ? "gray" : "blue"}
        onClick={open}
      >
        {initialData ? "Edit Review" : "Leave a Review"}
      </Button>
      <Modal
        size={"lg"}
        centered
        opened={opened}
        onClose={close}
        title={`Review your stay at ${accommodationTitle}`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Title"
              {...register("title")}
              required
              error={errors?.title?.message}
            />
            <Text size="sm" fw={500}>
              Rating
            </Text>
            <Rating
              size={"md"}
              value={watch("rating")}
              onChange={(val) => setValue("rating", val)}
              fractions={2}
              required
              error={errors?.rating?.message}
            />
            <Flex direction={"column"}>
              <Textarea
                autosize
                minRows={8}
                maxRows={12}
                label="Comment"
                placeholder="Tell us about your experience..."
                {...register("comment")}
                error={errors?.comment?.message}
                required
              />
              <Flex justify="space-between" my={"xs"}>
                <Text size="inherit" component="span">
                  Share your feedback
                </Text>
                <Text
                  size="inherit"
                  component="span"
                  c={
                    commentValue.length > MAX_COMMENT_LENGTH ? "red" : "dimmed"
                  }
                >
                  {commentValue.length} / {MAX_COMMENT_LENGTH}
                </Text>
              </Flex>
            </Flex>
            <Flex gap="sm" direction={{ base: "column", sm: "row" }}>
              <Button type="submit" loading={isSubmitting} fullWidth>
                {initialData ? "Update Review" : "Submit Review"}
              </Button>
              {initialData && (
                <Button
                  fullWidth
                  variant="outline"
                  color="red"
                  onClick={handleDelete}
                  loading={isDeleting}
                >
                  Delete
                </Button>
              )}
            </Flex>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default ReviewForm;
