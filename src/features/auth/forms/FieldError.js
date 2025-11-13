import { Flex, Text } from "@mantine/core";

export const FieldError = (error) => {
  //to look at later

  if (!error) return null;

  if ("types" in error && error.types) {
    return (
      <Flex direction={"column"} mt={"5px"}>
        {Object.values(error.types).map((messages, i) => {
          return (
            <Text key={i} size="xs" c={"red"}>
              {messages}{" "}
            </Text>
          );
        })}
      </Flex>
    );
  }
  if (error.message) {
    return (
      <Text mt={"xs"} size="xs" c={"red"}>
        {error.message}
      </Text>
    );
  }
  return null;
};

export default FieldError;
