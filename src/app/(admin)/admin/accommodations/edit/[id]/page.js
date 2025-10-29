import { eq } from "drizzle-orm";
import { accommodations } from "@/database/schema";
import { db } from "@/database/drizzle";
import { Text, Container, Box, Flex } from "@mantine/core";
import AccommodationForm from "@/features/admin/forms/AccommodationForm";
import { ErrorMessage } from "@/components/ui";
import { isValidUUID } from "@/utils/Helpers";

const EditPage = async ({ params }) => {
  const { id } = await params;

  if (!isValidUUID(id)) {
    return (
      <Container size={"sm"} component="section">
        <ErrorMessage
          title="Invalid ID"
          message="The provided accommodation ID is not valid."
          showBack
        />
      </Container>
    );
  }

  try {
    const [acc] = await db
      .select()
      .from(accommodations)
      .where(eq(accommodations.id, id))
      .execute();

    if (!acc) {
      <Container size={"sm"} component="section">
        <ErrorMessage
          title="Accommodation Not Found"
          message="We couldn't find the accommodation you’re trying to edit."
          showBack
        />
        <Text>Accommodation Not Found.</Text>
      </Container>;
    }

    return (
      <Container size={"sm"} component="section" className="">
        <Box mt={"sm"} mb={"sm"}>
          <Flex justify={"space-between"} align={"center"}></Flex>
          <Box component="section">
            <AccommodationForm
              accommodation={acc}
              pageTitle="Edit Accommodation"
            />
          </Box>
        </Box>
      </Container>
    );
  } catch (error) {
    return (
      <Container size={"sm"} component="section">
        <ErrorMessage
          title="Failed to Load Accommodation"
          message={error.message || "Please try again later."}
          // showRetry
          // onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  // console.log("edit- ", acc);
};

export default EditPage;
