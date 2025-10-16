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
import { auth } from "../../../../../auth";

const AccommodationDetailsPage = async ({ params }) => {
  const slug = (await params).slug;
  const session = await auth();

  const [accDetails] = await db
    .select()
    .from(accommodations)
    .where(eq(accommodations.slug, slug))
    .limit(1);
  if (!accDetails) redirect("/404");

  // console.log(accommodationDetails);
  return (
    <Box component="section">
      <AccommodationOverview
        title={accDetails.title}
        excerpt={accDetails.excerpt}
        pricePerNight={accDetails.pricePerNight}
        featuredImage={accDetails.featuredImage}
        images={accDetails.images}
        isAvailable={accDetails.isAvailable}
        averageRating={accDetails.averageRating}
      />
      <AccommodationDetails {...accDetails} />
      <Review />
    </Box>
  );
};

export default AccommodationDetailsPage;
