"use client";

import { Box, Text } from "@mantine/core";

const ErrorMessage = (props) => {
  return (
    <Box className="form-error-box" mt="lg" mb="lg">
      <Text size="xs" className="text-red-500">
        {props.errorMessage}
      </Text>
    </Box>
  );
};

export default ErrorMessage;
