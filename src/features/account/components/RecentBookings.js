import { Text, Paper, Grid, GridCol } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";

const RecentBooking = (data) => {
  return (
    <Paper
      withBorder
      p={"sm"}
      mb={"sm"}
      className="account-paperLink"
      role="link"
      tabIndex={"0"}
    >
      <Grid component="ul">
        <GridCol span={{ base: 12, sm: 5 }}>
          <Text truncate="end">{data.id}</Text>
        </GridCol>
        <GridCol span={{ base: 12, sm: 4 }}>
          <Text>{data.accommodation.title}</Text>
        </GridCol>
        <GridCol span={{ base: 12, sm: 3 }}>
          <Text>{dayjs(data.createdAt).format("DD/MM/YY")}</Text>
        </GridCol>
      </Grid>
      <Link
        className="card-link-account"
        href={`/account/booking-history/${data.id}`}
      >
        View Details
      </Link>
    </Paper>
  );
};

export default RecentBooking;
