import { Box, Flex, Title, Avatar, Text } from "@mantine/core";
import { getInitials } from "@/utils/Helpers";
import { Logout05Icon } from "@/components/icons";

const AdminLogOut = ({ session }) => {
  return (
    <Box p={"xs"} className="appshellnavbar__adminlogout">
      <Flex align={"center"} justify={"space-between"}>
        <Flex direction={"row"} align={"center"}>
          <Avatar
            name={getInitials(session.user.name) || null}
            allowedInitialsColors={["var(--clr-brown-5)"]}
            className="userAvatar__avatar"
            size="md"
            variant="outline"
            //   src=""
          />
          <Text fw={500} ml={"xs"} size="xs">
            {session?.user?.name}
          </Text>
        </Flex>
        <Logout05Icon width={24} height={24} color="var(--clr-semantic-red)" />
      </Flex>
    </Box>
  );
};

export default AdminLogOut;
