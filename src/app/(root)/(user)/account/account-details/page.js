import { auth } from "../../../../../../auth";
import { Box, Title } from "@mantine/core";
import DetailsForm from "@/features/account/forms/DetailsForm";

const AccountDetailsPage = async () => {
  const session = await auth();
  if (!session.user?.id) {
    redirect("/login");
  }

  return (
    <Box component="section">
      <Box component="header" mb={"lg"}>
        <Title>Account Details</Title>
      </Box>
      <DetailsForm session={session} />
    </Box>
  );
};

export default AccountDetailsPage;
