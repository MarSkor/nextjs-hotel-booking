import { Box, Select } from "@mantine/core";

const SortBy = () => {
  return (
    <Box className="sortby__wrapper">
      <Select
        clearable
        w={"100%"}
        classNames={{
          input: "booking-section__form--input",
          label: "booking-section__form--label",
        }}
        placeholder="Sort By"
        data={["Recommended", "Lowest Price", "Highest Price", "Reviews"]}
      />
    </Box>
  );
};

export default SortBy;
