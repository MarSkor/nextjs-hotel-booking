import { Accommodations } from "@/features/accommodations/components";
import getAccommodations from "@/actions/accommodationQueries";

const AccommodationPage = async ({ searchParams }) => {
  const params = await searchParams;

  const { type, guests, sort, page } = params;

  const accData = await getAccommodations({
    type,
    guests,
    sort,
    page: Number(page) || 1,
  });

  return <Accommodations {...accData} />;
};

export default AccommodationPage;
