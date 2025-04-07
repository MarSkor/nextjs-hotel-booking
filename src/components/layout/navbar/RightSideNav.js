import { useEffect, useState } from "react";
import Link from "next/link";
import { Group, Button } from "@mantine/core";
import UserAccountNav from "./UserAccountNav";

const RightSideNav = () => {
  const [user, setUser] = useState(true);

  // useEffect(() => {
  //   async function checkUser() {
  //     const supabase = createClient();
  //     const { data } = await supabase.auth.getUser();
  //     if (data.user) {
  //       setUser(data.user);
  //     }
  //   }
  //   checkUser();
  // }, []);

  console.log("user, rightside nav", user);

  return (
    <Group visibleFrom="md">
      {/* <SearchBar/> */}
      {user ? (
        <UserAccountNav user={user} />
      ) : (
        <Button
          variant="transparent"
          component={Link}
          href={"/login"}
          color="#c5bcb3"
        >
          Log in
        </Button>
      )}
      <Button
        className="btn btn-secondary"
        variant="outline"
        color="#c5bcb3"
        component={Link}
        href={"/accommodation"}
      >
        Book Now
      </Button>
    </Group>
  );
};

export default RightSideNav;
