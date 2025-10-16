import { Accommodations } from "@/features/accommodations/components";
import { db } from "@/database/drizzle";
import { accommodations } from "@/database/schema/accommodations";

const AccommodationPage = async () => {
  const accommodationsList = await db.select().from(accommodations);

  return <Accommodations data={accommodationsList} />;
};

export default AccommodationPage;
