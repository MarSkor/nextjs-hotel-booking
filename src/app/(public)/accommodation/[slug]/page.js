import {
  DetailsHeader,
  DetailsContent,
} from "@/features/accommodations/components";
import { mockData } from "@/components/ui/data";

const AccommodationDetailsPage = () => {
  // const { title } = data;
  // console.log("mock data-", mockData);

  return (
    <>
      <DetailsHeader data={mockData} />
      <DetailsContent data={mockData} />
    </>
  );
};

export default AccommodationDetailsPage;
