"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { accommodationSchema } from "@/lib/validations";
import FileUpload from "./FileUpload";
import { slugify } from "@/utils/Helpers";
import { IconArrowLeft } from "@/components/icons";
import DeleteModal from "../components/DeleteModal";
import { mantineNotify } from "@/lib/mantineNotify";
import {
  createAccommodation,
  updateAccommodation,
} from "@/actions/accommodation";
import { deleteResourceAction } from "@/actions/admin";
import { deleteImageFile, deleteTempImageFile } from "@/actions/images";
import { ErrorMessage } from "@/components/ui";
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
  Checkbox,
  SimpleGrid,
  Title,
} from "@mantine/core";

const AccommodationForm = ({ accommodation = null, pageTitle = "" }) => {
  const isEditing = Boolean(accommodation?.id);
  const router = useRouter();
  const [formError, setFormError] = useState(null);

  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(accommodationSchema),
    defaultValues: {
      slug: accommodation?.slug || "temp-slug",
      title: accommodation?.title || "",
      excerpt: accommodation?.excerpt || "",
      propertyType: accommodation?.propertyType || "",
      bodyText: accommodation?.bodyText || "",
      pricePerNight: accommodation?.pricePerNight || 1,
      guests: accommodation?.guests || 1,
      queenBeds: accommodation?.queenBeds || 0,
      fullBeds: accommodation?.fullBeds || 0,
      twinBeds: accommodation?.twinBeds || 0,
      amenities: accommodation?.amenities || [],
      street: accommodation?.street || "",
      buildingNumber: accommodation?.buildingNumber || 1,
      featuredImage: accommodation?.featuredImage || null,
      images: accommodation?.images || [],
      isAvailable: accommodation?.isFeatured || true,
      isFeatured: accommodation?.isFeatured || false,
    },
    mode: "onChange",
    criteriaMode: "all",
  });

  const onSubmit = async (data) => {
    const slug = slugify(data.title);
    setFormError(null);
    try {
      if (isEditing) {
        const res = await updateAccommodation({
          ...data,
          id: accommodation.id,
          slug,
          featuredImage: data.featuredImage || null,
        });
        if (res.success) {
          mantineNotify.success("Accommodation updated successfully");
          router.refresh();
        } else {
          setFormError(res.message || "Failed to update the accommodation.");
          mantineNotify.error(
            res.message || "Failed to update the accommodation.",
          );
        }
      } else {
        const res = await createAccommodation({
          ...data,
          slug,
          featuredImage: data.featuredImage || null,
        });

        if (res.success) {
          mantineNotify.success("Accommodation created successfully");
          router.push(`/admin/accommodations/edit/${res.data.id}`);
        } else {
          mantineNotify.error(
            res.message || "Error. Failed to create accommodation.",
          );
          setFormError(res.message || "Failed to create accommodation.");
        }
      }
    } catch (error) {
      // console.error("Could not submit form", error);
      setFormError(error.message);
    }
  };

  const handleDelete = async (fileId) => {
    if (!fileId) return;

    try {
      let res;
      if (accommodation?.id) {
        res = await deleteImageFile(fileId, accommodation.id);
      } else {
        res = await deleteTempImageFile(fileId);
      }
      if (res.success) {
        mantineNotify.success("Image successfully deleted");
        setValue("featuredImage", null);
      } else {
        mantineNotify.error(res.message || "Failed to delete image.");
      }

      return res;
    } catch (error) {
      // console.error("Error deleting image: ", error);
      mantineNotify.error("Unexpected error deleting image.");
      return { success: false };
    }
  };

  return (
    <>
      <Box component="section" mt={"sm"} mb={"sm"}>
        <Flex justify={"space-between"}>
          <Button
            size="sm"
            style={{ width: "max-content" }}
            component={Link}
            href={"/admin/accommodations"}
            variant="light"
            leftSection={<IconArrowLeft height={18} width={18} />}
          >
            Back to Accommodations
          </Button>
          {isEditing && (
            <DeleteModal
              id={accommodation.id}
              resourceName="accommodations"
              title="Delete Accommodation"
              message={`Are you sure you want to delete "${accommodation.title}"? This action cannot be undone.`}
              deleteAction={deleteResourceAction}
              redirectAfter="/admin/accommodations"
              triggerType={"button"}
            />
          )}
        </Flex>
        <Title order={1} mt={"md"} mb={"md"}>
          {pageTitle}
        </Title>
      </Box>
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
            disabled
            label="Slug"
            readOnly
            size="sm"
            error={errors.slug?.message}
            value={
              isEditing ? accommodation?.slug : slugify(watch("title") || "")
            }
            placeholder="auto-generated slug"
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
                description="Main image when booking accommodation."
                placeholder={"Upload Image"}
                onFileChange={field.onChange}
                type="image"
                accept="image/*"
                multiple={false}
                folder="accommodations"
                accId={accommodation?.id}
                value={field.value}
                error={errors.featuredImage?.message}
                onDelete={handleDelete}
              />
            )}
          />
        </Box>
        {/* imageGallery - to create */}
        {/* <Box mt="sm" mb="lg">
          <Controller
            name={"images"}
            control={control}
            render={({ field }) => (
              <FileUpload
                label="Upload Image Gallery"
                description="Upload additional images to better show the accommodation."
                placeholder={"Upload Images"}
                onFileChange={field.onChange}
                type="image"
                accept="image/*"
                multiple
                folder="accommodations"
                value={field.value}
                error={errors.images?.message}
              />
            )}
          />
        </Box> */}
        {/* isFeatured  */}
        <Box mt="sm" mb="lg">
          <Controller
            name={"isFeatured"}
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Set Accommodation to Featured"
                checked={field.value}
                onChange={(event) =>
                  field.onChange(event.currentTarget.checked)
                }
              />
            )}
          />
        </Box>

        {formError && <ErrorMessage title="Error" message={formError} />}

        {/* Submit and Delete  */}
        <Box>
          <Button
            fullWidth
            mt={rem("32px")}
            mb={"lg"}
            size="md"
            radius="sm"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Accommodation"
                : "Create Accommodation"}
          </Button>
          {isEditing && (
            <DeleteModal
              id={accommodation.id}
              resourceName="accommodations"
              title="Delete Accommodation"
              message={`Are you sure you want to delete "${accommodation.title}"? This action cannot be undone.`}
              deleteAction={deleteResourceAction}
              redirectAfter="/admin/accommodations"
              triggerType="button"
              fullWidth
              size={"md"}
              color="red"
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default AccommodationForm;
