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

const AccommodationDetailsPage = async ({ params }) => {
  const slug = (await params).slug;

  const [accDetails] = await db
    .select()
    .from(accommodations)
    .where(eq(accommodations.slug, slug))
    .limit(1);
  if (!accDetails) redirect("/404");

  return (
    <Box component="section">
      <AccommodationOverview {...accDetails} />
      <AccommodationDetails {...accDetails} />
      <Review />
    </Box>
  );
};

export default AccommodationDetailsPage;
