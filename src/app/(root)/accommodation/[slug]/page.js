import {
  AccommodationOverview,
  AccommodationDetails,
  Reviews,
} from "@/features/accommodations/components";
import { Box } from "@mantine/core";
import { db } from "@/database/drizzle";
import { redirect } from "next/navigation";
import { isAccommodationFavorite } from "@/actions/user";

const AccommodationDetailsPage = async ({ params }) => {
  const slug = (await params).slug;

  const data = await db.query.accommodations.findFirst({
    where: (accommodations, { eq }) => eq(accommodations.slug, slug),
    with: {
      reviews: {
        where: (reviews, { eq }) => eq(reviews.status, "APPROVED"),
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
        with: {
          user: true,
          reply: true,
        },
      },
    },
  });

  if (!data) redirect("/404");

  const reviewCount = data.reviews.length;
  const averageRating =
    reviewCount > 0
      ? data.reviews.reduce((sum, rev) => sum + Number(rev.rating), 0) /
        reviewCount
      : 0;

  const isFavorite = await isAccommodationFavorite(data.id);

  return (
    <Box component="section">
      <AccommodationOverview
        accDetails={data}
        isFavorite={isFavorite}
        reviewCount={reviewCount}
        averageRating={averageRating}
      />
      <AccommodationDetails {...data} />
      <Reviews reviews={data.reviews} />
    </Box>
  );
};

export default AccommodationDetailsPage;
