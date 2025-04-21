import { useEffect, useState } from "react";
import Link from "next/link";
import { Group, Button, Text } from "@mantine/core";
import NavbarUserAccount from "./NavbarUserAccount";
import NavLink from "./NavLink";

const NavbarRight = () => {
  const [user, setUser] = useState(true);

  return (
    <Group visibleFrom="md" className="navbar__right">
      {/* <SearchBar/> */}
      {user ? (
        <NavbarUserAccount user={user} />
      ) : (
        <NavLink href="/login" label="Log in" vp="lg" />
      )}
      <Button
        className="btn btn-navbar btn-500"
        component={Link}
        href={"/accommodation"}
      >
        Explore Rooms
      </Button>
    </Group>
  );
};

export default NavbarRight;
