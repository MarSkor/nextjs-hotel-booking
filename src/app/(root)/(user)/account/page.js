import {
  Box,
  Title,
  Text,
  Flex,
  Anchor,
  Grid,
  GridCol,
  Divider,
} from "@mantine/core";
import { auth } from "../../../../../auth";
import Link from "next/link";

const MyAccountPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Box component={"section"} className="account__page-wrapper">
      <Box component="header" mb={"lg"}>
        <Title order={1}>Welcome</Title>
        <Text size="sm" mt={"xs"}>
          Discover stays handpicked for comfort, style, and unforgettable
          experiences.
        </Text>
      </Box>
      <Flex mb={"xl"}>
        <Title order={2}>My Personal Information</Title>
      </Flex>
      <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
        <GridCol span={{ base: 12, md: 6 }}>
          <Flex direction={"column"}>
            <Box component="header">
              <Flex align={"center"} justify={"space-between"}>
                <Title order={3}>Contact Information</Title>
                <Anchor component={Link} href={"/account/account-details"}>
                  Edit
                </Anchor>
              </Flex>
              <Divider my="md" />
            </Box>
            <Box>
              <Text>{session?.user.name}</Text>
              <Text>{session?.user.email}</Text>
            </Box>
          </Flex>
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <Flex direction={"column"}>
            <Box component="header">
              <Title order={3}>Billing/Shipping Address</Title>
              <Divider my="md" />
            </Box>
          </Flex>
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <Box component="header">
            <Title order={3}>Recent Travels</Title>
            <Divider my="md" />
          </Box>
          <Box>travel list here</Box>
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <Box component="header">
            <Title order={3}>Payment Method</Title>
            <Divider my="md" />
          </Box>
          <Box>payment method here</Box>
        </GridCol>
      </Grid>
    </Box>
  );
};

export default MyAccountPage;
