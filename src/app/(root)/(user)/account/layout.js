import { Container, Box } from "@mantine/core";
import { AccountNav } from "@/features/account/components";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";

const UserLayout = async ({ children }) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Container
      component="section"
      size="lg"
      className="account__col-wrapper"
      mt="lg"
      mb="lg"
    >
      <Box className="account__col account__left-col">
        <AccountNav />
      </Box>
      <Box className="account__col account__right-col">{children}</Box>
    </Container>
  );
};

export default UserLayout;
