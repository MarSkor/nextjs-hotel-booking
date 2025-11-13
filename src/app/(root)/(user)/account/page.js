import { auth, signOut } from "../../../../../auth";
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
  Button,
} from "@mantine/core";
import { IconLogOut } from "@/components/icons";

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
      <Box component="header" mb={"lg"}>
        <Title mb={"xs"} order={1}>
          Welcome!
        </Title>
        <Text>
          Here you can find an overview over your information, your booking
          history or edit your personal details.
        </Text>
      </Box>
      <Grid>
        <GridCol span={{ base: 12, md: 6 }}>
          <PaperLink
            title={"Account Details"}
            description={"View and edit your account details."}
            href={"/account/account-details"}
          />
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <PaperLink
            title={"Booking History"}
            description={"List of your recent bookings."}
            href={"/account/booking-history"}
          />
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <PaperLink
            title={"Settings"}
            description={"lorem ipsum"}
            href={"/account/settings"}
          />
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <PaperLink
            title={"Payment & Billing"}
            description={"lorem ipsum"}
            href={"/account"}
          />
        </GridCol>
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
      <Box mt={"xl"} style={{ cursor: "pointer" }}>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button
            leftSection={<IconLogOut color="var(--mantine-color-white)" />}
            type="submit"
          >
            Sign Out
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default MyAccountPage;
