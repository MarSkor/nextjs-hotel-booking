import { auth } from "../../../../../auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
import {
  Box,
  Title,
  Text,
  Flex,
  Grid,
  GridCol,
  Paper,
  Divider,
} from "@mantine/core";
import { LogOutButton } from "@/components/ui";

const MyAccountPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = await db
    .select({ isAdmin: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");

  const links = [
    {
      href: "/account/account-details",
      label: "Account Details",
      description: "Change email or password.",
    },
    {
      href: "/account/booking-history",
      label: "Booking History",
      description: "List of your recent bookings.",
    },
    {
      href: "/account/settings",
      label: "Settings",
      description: "Delete Account.",
    },
    {
      href: "/account/favorites",
      label: "Favorites",
      description: "Keep track of your favorites.",
    },
  ];

  const PaperLink = ({ title, href, description }) => (
    <Link href={href} className="account-paperLink">
      <Paper p={"sm"} withBorder className="account-paperLinkPaper">
        <Flex direction={"column"}>
          <Title mb={"xs"} order={4}>
            {title}
          </Title>
          <Text c={"dimmed"}>{description}</Text>
        </Flex>
      </Paper>
    </Link>
  );

  return (
    <Box component={"section"} className="account__page-wrapper">
      <Box component="header">
        <Title mb={"xs"} order={1}>
          Welcome!
        </Title>
        <Text mb={"xs"}>
          Logged in as{" "}
          <Text span fw={500}>
            {session?.user?.name}
          </Text>
        </Text>
        <Text>
          Here you can find an overview over your information, your booking
          history or edit your personal details.
        </Text>
      </Box>
      <Divider my={"lg"} />
      <Grid>
        {links.map((item, i) => (
          <GridCol key={item.href} span={{ base: 12, md: 6 }}>
            <PaperLink
              title={item.label}
              description={item.description}
              href={item.href}
            />
          </GridCol>
        ))}
        {isAdmin && (
          <GridCol span={{ base: 12, md: 6 }}>
            <Link href={"/admin"} className="account-paperLink">
              <Paper p={"sm"} withBorder className="account-paperLinkPaper">
                <Flex direction={"column"}>
                  <Title mb={"xs"} order={4}>
                    Admin Dashboard
                  </Title>
                  <Text c={"dimmed"}>
                    View, create, update, and delete resources of Holidaze.
                  </Text>
                </Flex>
              </Paper>
            </Link>
          </GridCol>
        )}
      </Grid>
      <Box mt={"xl"}>
        <LogOutButton />
      </Box>
    </Box>
  );
};

export default MyAccountPage;
