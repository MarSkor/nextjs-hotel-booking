import { Box, Flex, Avatar, Text, Button } from "@mantine/core";
import { getInitials } from "@/utils/Helpers";
import { Logout05Icon } from "@/components/icons";
import { signOut } from "next-auth/react";

const AdminLogOut = ({ session }) => {
  return (
    <Flex direction={"column"}>
      <Box mb={"sm"}>
        <Flex direction={"row"} align={"center"}>
          <Avatar
            name={getInitials(session.user.name) || null}
            allowedInitialsColors={["var(--clr-brown-5)"]}
            className="userAvatar__avatar"
            size="md"
            variant="outline"
          />
          <Text fw={500} ml={"xs"} size="sm">
            {session?.user?.name}
          </Text>
        </Flex>
      </Box>
      <Box>
        <Button
          justify="flex-start"
          fullWidth
          variant="transparent"
          color="red"
          onClick={() => signOut()}
          leftSection={
            <Logout05Icon
              width={24}
              height={24}
              color="var(--mantine-semantic-red)"
            />
          }
        >
          Log Out
        </Button>
      </Box>
    </Flex>
  );
};

export default AdminLogOut;
