import { IKImage } from "imagekitio-next";
import config from "@/lib/config";
import dayjs from "dayjs";
import { Flex, Box, Paper, Text, GridCol, Title } from "@mantine/core";

const BookingSummary = ({ bookingData, imagePath, totalNights }) => {
  return (
    <GridCol span={{ base: 12, sm: 4 }}>
      <Paper withBorder>
        {/* image  */}
        <Box
          style={{
            width: "100%",
            position: "relative",
            height: 150,
            overflow: "hidden",
          }}
        >
          <IKImage
            alt="Accommodation Booking Cover"
            path={imagePath}
            urlEndpoint={config.env.imagekit.urlEndpoint}
            fill
            loading="lazy"
            lqip={{ active: true }}
            style={{
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            transformation={[
              { width: "1200", height: "400", crop: "maintain_ratio" },
            ]}
          />
        </Box>
        {/* details  */}
        <Box p={"md"}>
          <Title tt="capitalize" order={3} mb={"sm"}>
            {bookingData?.title}
          </Title>
          <Flex align={"center"} justify={"space-between"}>
            <Text fw={500}>Check In:</Text>{" "}
            <Text>{dayjs(bookingData.checkIn).format("DD/MM/YYYY")}</Text>
          </Flex>
          <Flex my={"xs"} align={"center"} justify={"space-between"}>
            <Text fw={500}>Check Out:</Text>{" "}
            <Text>{dayjs(bookingData.checkOut).format("DD/MM/YYYY")}</Text>
          </Flex>
          <Flex my={"xs"} align={"center"} justify={"space-between"}>
            <Text fw={500}>Total Nights:</Text> <Text>{totalNights}</Text>
          </Flex>
          <Flex align={"center"} justify={"space-between"}>
            <Text fw={500}>Number of guests:</Text>{" "}
            <Text>{bookingData.guests}</Text>
          </Flex>
        </Box>
      </Paper>
      <Paper withBorder p={"md"} mt={"sm"}>
        <Flex align={"center"} justify={"space-between"}>
          <Text span fw={500}>
            Total Price:
          </Text>{" "}
          <Text>${bookingData?.totalPrice}</Text>
        </Flex>
      </Paper>
    </GridCol>
  );
};

export default BookingSummary;
