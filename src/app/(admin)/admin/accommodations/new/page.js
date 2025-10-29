import AccommodationForm from "@/features/admin/forms/AccommodationForm";
import { Container } from "@mantine/core";

const NewAccommodationPage = () => {
  return (
    <Container size={"sm"} component="section" className="">
      <AccommodationForm pageTitle="Create new Accommodation" />
    </Container>
  );
};

export default NewAccommodationPage;
