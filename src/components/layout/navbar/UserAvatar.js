import { Avatar, Box } from "@mantine/core";
import { getInitials } from "@/utils/Helpers";

const UserAvatar = ({ session }) => {
  if (!session?.user) return null;
  console.log("useravatar", session);
  return (
    <Box>
      <Avatar
        variant="transparent"
        radius="sm"
        size="md"
        name={getInitials(session.user.name)}
        src={getInitials(session.user.name) || null}
      />
    </Box>
  );
};

export default UserAvatar;
