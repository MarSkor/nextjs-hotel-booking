"use server";
import { Accommodations } from "@/features/accommodations/components";
import getAccommodations from "@/actions/sorting";

const AccommodationPage = async ({ searchParams }) => {
  const params = await searchParams;
  const { type, guests, sort, page, checkIn, checkOut } = params;

  const accData = await getAccommodations({
    type,
    guests,
    sort,
    page: Number(page) || 1,
    checkIn,
    checkOut,
  });

  return <Accommodations {...accData} />;
};

export default AccommodationPage;
