import BookingEnquiryForm from "@/features/booking/forms/BookingEnquiryForm";
import { Container } from "@mantine/core";

const EnquiryPage = async () => {
  return (
    <Container size={"md"} component="section">
      <BookingEnquiryForm />
    </Container>
  );
};

export default EnquiryPage;
