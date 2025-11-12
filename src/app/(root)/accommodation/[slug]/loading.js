import { Flex, Loader } from "@mantine/core";

const loading = () => {
  return (
    <Flex justify={"center"} align={"center"} h="80vh">
      <Loader color="blue" />
    </Flex>
  );
};

export default loading;
