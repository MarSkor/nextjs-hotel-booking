"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Flex,
  Text,
  Title,
  SimpleGrid,
  Select,
  Pagination,
} from "@mantine/core";
import { BookingSearchField } from "../forms";
import { Card } from "@/components/ui";
import { mockData } from "./mockdata";
// import SortBy from "./SortBy";

const ITEMS_PER_PAGE = 6;

const Accommodations = () => {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedItems = useMemo(() => {
    return [...mockData].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
  }, [sortOrder]);

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);

  const paginatedAccommodations = sortedItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const accommodations = paginatedAccommodations.map((item) => (
    <Card key={item.id} {...item} />
  ));

  return (
    <Container
      component="section"
      size="lg"
      className="accommodations-container"
      mt="lg"
      mb="lg"
    >
      <Flex
        direction={"column"}
        mt={"xl"}
        mb={"xl"}
        justify={"center"}
        className="accommodations-header__top-header"
      >
        <Title className="accommodations-header__top-header--title" order={1}>
          Find the right stay for you
        </Title>
        {/* search field, implementing later  */}
        <Box mt={"xl"}>
          <BookingSearchField page="acs" size="lg" />
        </Box>
      </Flex>
      {/* sorting and results  */}
      <Flex justify={"space-between"} align={"center"} mt={"lg"} mb={"lg"}>
        {/* <SortBy /> */}
        <Box className="sortby__wrapper">
          <Select
            w={"100%"}
            classNames={{
              input: "booking-section__form--input",
              label: "booking-section__form--label",
            }}
            placeholder="Sort By"
            data={[
              { label: "Price (lowest first)", value: "asc" },
              { label: "Price (highest first)", value: "desc" },
            ]}
            value={sortOrder}
            onChange={(value) => {
              setSortOrder(value);
              setPage(1);
            }}
          />
        </Box>

        <Flex className="accommodations-header__acs-number">
          <Text size="xs" c="dimmed">
            {/* Dynamic number */} 1234 Accommodations
          </Text>
        </Flex>
      </Flex>
      {/* accommodations result */}
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {accommodations}
      </SimpleGrid>
      {/* pagination  */}
      <Flex justify={"center"} mt={"48px"} mb={"48px"} align={"center"}>
        <Pagination
          value={page}
          onChange={setPage}
          total={totalPages}
          position="center"
        />
      </Flex>
    </Container>
  );
};

export default Accommodations;
