import { Avatar, Box } from "@mantine/core";
import { getInitials } from "@/utils/Helpers";
import Link from "next/link";

const UserAvatar = ({ session }) => {
  if (!session?.user) return null;
  // console.log("useravatar", session);
  return (
    <Link href={"/my-account"} className="userAvatar__link">
      <Box className="userAvatar__inner">
        <Avatar
          className="userAvatar__avatar"
          radius="sm"
          size="md"
          name={getInitials(session.user.name) || null}
          allowedInitialsColors={["var(--clr-brown-5)"]}
          color="initials"
        />
      </Box>
    </Link>
  );
};

export default UserAvatar;
