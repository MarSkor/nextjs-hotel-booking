"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { accommodationSchema } from "@/lib/validations";
import { FileUpload } from "@/components/ui";
import {
  TextInput,
  Button,
  Flex,
  Box,
  rem,
  Textarea,
  NumberInput,
  TagsInput,
  Select,
  Text,
  Checkbox,
  SimpleGrid,
} from "@mantine/core";
import { toast } from "sonner";
import { createAccommodation } from "@/actions/accommodation";
import { slugify } from "@/utils/Helpers";

const AccommodationForm = () => {
  const [formError, setFormError] = useState(null);
  const router = useRouter();

  const {
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(accommodationSchema),
    defaultValues: {
      slug: "temp-slug",
      title: "",
      excerpt: "",
      propertyType: "",
      bodyText: "",
      pricePerNight: 1,
      guests: 1,
      queenBeds: 0,
      fullBeds: 0,
      twinBeds: 0,
      amenities: [],
      street: "",
      buildingNumber: 1,
      featuredImage: "",
      images: [], //to implement
      isAvailable: true,
      isFeatured: false,
    },
    mode: "onChange",
    criteriaMode: "all",
  });
  const title = watch("title");

  console.log("errors", errors);

  const onSubmit = async (data) => {
    const slug = slugify(data.title);
    const res = await createAccommodation({ ...data, slug });
    console.log("form res", res);
    if (res.success) {
      toast.success("Accommodation created successfully", {
        position: "top-center",
      });
      // router.push(`/admin/accommodations/${res.data.id}`);
    } else {
      toast.error("Error", {
        description: res.message,
        position: "top-center",
      });
      setFormError(res.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mb={rem("94px")}>
      {/* title  */}
      <Box mt="sm" mb="lg">
        <Controller
          name={"title"}
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              size="sm"
              required
              label={"Title"}
              error={errors.title?.message}
            />
          )}
        />
      </Box>
      {/* slug  */}
      <Box mt="sm" mb="lg">
        <TextInput
          label="Slug"
          readOnly
          size="sm"
          error={errors.slug?.message}
          placeholder={slugify(title)}
        />
      </Box>
      {/* excerpt  */}
      <Box mt="sm" mb="lg">
        <Controller
          name={"excerpt"}
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              size="sm"
              required
              label={"Excerpt"}
              error={errors.excerpt?.message}
            />
          )}
        />
      </Box>
      {/* propertyType  */}
      <Box mt="sm" mb="lg">
        <Controller
          name={"propertyType"}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              size="sm"
              required
              label={"Property Type"}
              data={[
                {
                  value: "bed_and_breakfast",
                  label: "B&B",
                },
                { value: "hotel", label: "Hotel" },
                { value: "guesthouse", label: "Guesthouse" },
              ]}
              error={errors.propertyType?.message}
            />
          )}
        />
      </Box>
      {/* bodyText */}
      <Box mt="sm" mb="lg">
        <Controller
          name={"bodyText"}
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              size="sm"
              required
              label={"Full description"}
              error={errors.bodyText?.message}
              autosize
              minRows={8}
              maxRows={10}
            />
          )}
        />
      </Box>
      {/* pricePerNight */}
      <Box mt="sm" mb="lg">
        <Controller
          name={"pricePerNight"}
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              value={field.value ?? 0}
              onChange={(val) => field.onChange(val ?? 0)}
              size="sm"
              required
              label={"Price per night"}
              error={errors.pricePerNight?.message}
              leftSection="$"
              stepHoldDelay={500}
              stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
              min={1}
            />
          )}
        />
      </Box>
      {/* guests */}
      <Box mt="sm" mb="lg">
        <Controller
          name={"guests"}
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              size="sm"
              required
              description="Maximum 5 guests"
              label={"Guests"}
              error={errors.guests?.message}
              min={1}
              max={5}
            />
          )}
        />
      </Box>
      {/* beds  */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={{ base: 0, sm: "sm" }}>
        {/* queenBeds */}
        <Box mt="sm" mb="lg">
          <Controller
            name="queenBeds"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Queen Beds"
                min={0}
                {...field}
                error={errors.queenBeds?.message}
              />
            )}
          />
        </Box>
        {/* fullBeds */}
        <Box mt="sm" mb="lg">
          <Controller
            name="fullBeds"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Full Beds"
                min={0}
                {...field}
                error={errors.fullBeds?.message}
              />
            )}
          />
        </Box>
        {/* twinBeds */}
        <Box mt="sm" mb="lg">
          <Controller
            name="twinBeds"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Twin Beds"
                min={0}
                {...field}
                error={errors.twinBeds?.message}
              />
            )}
          />
        </Box>
      </SimpleGrid>
      {/* amenities */}
      <Box mt="sm" mb="lg">
        <Controller
          name={"amenities"}
          control={control}
          render={({ field }) => (
            <TagsInput
              value={field.value || []}
              description="Add up to 15 amenities. Minimum 1."
              size="sm"
              required
              label={"Amenities"}
              splitChars={[",", " "]}
              onChange={field.onChange}
              error={errors.amenities?.message}
            />
          )}
        />
      </Box>
      {/* street + buildingNumber */}
      <Flex
        w={"100%"}
        direction={{ base: "column", sm: "row" }}
        gap={{ sm: "lg" }}
      >
        <Box mt="sm" mb="lg" w={{ base: "100%", sm: "50%" }}>
          <Controller
            name={"street"}
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                size="sm"
                required
                label={"Street"}
                error={errors.street?.message}
              />
            )}
          />
        </Box>
        <Box mt="sm" mb="lg" w={{ base: "100%", sm: "50%" }}>
          <Controller
            name={"buildingNumber"}
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                size="sm"
                required
                label={"Building Number"}
                value={field.value ?? 1}
                onChange={(val) => field.onChange(Number(val ?? 1))}
                error={errors.buildingNumber?.message}
              />
            )}
          />
        </Box>
      </Flex>
      {/* featuredImage */}
      <Box mt="sm" mb="lg">
        <Controller
          name={"featuredImage"}
          control={control}
          render={({ field }) => (
            <FileUpload
              label="Upload Featured Image"
              description="The first image users will see when booking accommodation."
              placeholder={"Upload Image"}
              onFileChange={field.onChange}
              type="image"
              accept="image/*"
              multiple={false}
              folder="accommodations"
              value={field.value}
              error={errors.featuredImage?.message}
            />
          )}
        />
      </Box>
      {/* isFeatured  */}
      <Box mt="sm" mb="lg">
        <Controller
          name={"isFeatured"}
          control={control}
          render={({ field }) => (
            <Checkbox
              label="Set Accommodation to Featured"
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
            />
          )}
        />
      </Box>

      {formError && (
        <Box>
          <Text size="xs">{formError}</Text>
        </Box>
      )}

      <Button
        fullWidth
        mt={rem("32px")}
        size="md"
        radius="md"
        type="submit"
        disabled={isSubmitting}
        // loading={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create accommodation"}
      </Button>
    </Box>
  );
};

export default AccommodationForm;
