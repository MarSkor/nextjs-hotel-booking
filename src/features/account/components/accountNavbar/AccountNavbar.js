"use client";
// import { signOutAction } from "@/actions/user";
import { Box, Flex, Button, UnstyledButton } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_DATA = [
  { href: "/account", label: "My Account" },
  { href: "/account/settings", label: "Settings" },
  { href: "/account/bookings", label: "Bookings" },
];

const AccountNavbar = () => {
  const pathname = usePathname();

  return (
    <nav className="accountNavbar ">
      <Flex
        direction={{ base: "row", xs: "column" }}
        className="accountNavbar__inner"
      >
        <ul className="accountNavbar__list">
          {NAV_DATA.map((item, index) => (
            <li key={index} className="accountNavbar__list--item">
              <Link
                href={item.href}
                className={` ${pathname === item.href ? "active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="accountNavbar__list--item">
            <UnstyledButton
              className="accountNavbar__list--item--btn"
              // onClick={signOutAction}
            >
              Sign Out
            </UnstyledButton>
          </li>

          {/* <form style={{ width: "100%" }} action="/auth/signout" method="post">
            {" "}
            <Button fullWidth type="submit">
              Sign out
            </Button>
          </form> */}
        </ul>
        {/* <Button href="#" component={Link}>
          Sign out
        </Button> */}
      </Flex>
    </nav>
  );
};

export default AccountNavbar;
