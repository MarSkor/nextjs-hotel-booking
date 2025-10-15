import AccommodationForm from "@/features/admin/forms/AccommodationForm";
import { Box, Button, Container, Title } from "@mantine/core";
import Link from "next/link";

const Page = () => {
  return (
    <Container size={"sm"} component="section" className="">
      <Box mt={"sm"} mb={"sm"}>
        <Button
          style={{ width: "max-content" }}
          component={Link}
          href={"/admin/accommodations"}
          variant="light"
        >
          Go back
        </Button>
        <Box component="section">
          <Title order={1} mt={"md"} mb={"md"}>
            Create new Accommodation
          </Title>
          <AccommodationForm />
        </Box>
      </Box>
    </Container>
  );
};

export default Page;
