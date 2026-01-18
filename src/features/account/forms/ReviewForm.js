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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { submitReview } from "@/actions/review";

const ReviewForm = ({
  bookingId,
  accommodationId,
  accommodationTitle,
  initialData,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      rating: initialData ? parseFloat(initialData.rating) : 0,
      comment: initialData?.comment || "",
    },
  });

  const onSubmit = async (data) => {
    const res = await submitReview({ ...data, bookingId, accommodationId });
    if (res.success) close();
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
        size={"md"}
        centered
        opened={opened}
        onClose={close}
        title={`Review your stay at ${accommodationTitle}`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput label="Title" {...register("title")} required />
            <Text size="sm" fw={500}>
              Rating
            </Text>
            <Rating
              size={"md"}
              value={watch("rating")}
              onChange={(val) => setValue("rating", val)}
              fractions={2}
              required
            />
            <Textarea
              autosize
              minRows={4}
              maxRows={6}
              label="Comment"
              placeholder="Tell us about your experience..."
              {...register("comment")}
              required
            />
            <Button type="submit" loading={isSubmitting} fullWidth>
              {initialData ? "Update Review" : "Submit Review"}
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default ReviewForm;
