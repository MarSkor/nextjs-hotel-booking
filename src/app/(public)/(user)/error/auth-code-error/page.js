import { Box, Text } from "@mantine/core";

export default async function AuthError({ searchParams }) {
  const params = await searchParams;
  // console.log("auth error sparams", params);
  // console.log("auth error params", params);

  if (params.get("error_code").startsWith("4")) {
    // show error message if error is a 4xx error
    window.alert(params.get("error_description"));
  }

  console.log("params", params);
  return (
    <section>
      <Box>
        <Text>auth error code here</Text>
      </Box>
    </section>
  );
}
