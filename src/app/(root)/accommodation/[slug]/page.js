import {
  DetailsHeader,
  DetailsContent,
} from "@/features/accommodations/components";

const AccommodationDetailsPage = (props) => {
  // console.log("details", props); implementing fetch details later

  return (
    <article>
      <DetailsHeader />
      <DetailsContent />
    </article>
  );
};

export default AccommodationDetailsPage;
