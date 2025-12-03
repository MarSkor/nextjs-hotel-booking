import { accommodations } from "@/database/schema";
import {
  AccommodationOverview,
  AccommodationDetails,
  Review,
} from "@/features/accommodations/components";
import { Box } from "@mantine/core";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { isAccommodationFavorite } from "@/actions/user";

const AccommodationDetailsPage = async ({ params }) => {
  const slug = (await params).slug;

  const [accDetails] = await db
    .select()
    .from(accommodations)
    .where(eq(accommodations.slug, slug))
    .limit(1);
  if (!accDetails) redirect("/404");

  const isFavorite = await isAccommodationFavorite(accDetails.id);

  return (
    <Box component="section">
      <AccommodationOverview accDetails={accDetails} isFavorite={isFavorite} />
      <AccommodationDetails {...accDetails} />
      <Review />
    </Box>
  );
};

export default AccommodationDetailsPage;
