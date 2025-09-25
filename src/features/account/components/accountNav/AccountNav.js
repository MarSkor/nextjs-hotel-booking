import AccountLink from "./AccountLink";
import { Flex, Box } from "@mantine/core";
import { LogOutButton } from "@/components/ui";

const Links = [
  { href: "/account", label: "My Page" },
  { href: "/account/account-details", label: "Account Details" },
  { href: "/account/booking-history", label: "Booking History" },
];

const AccountNav = () => {
  return (
    <Box component="nav" bdrs="lg" className="accountnav__wrapper">
      <Flex
        className="accountnav__inner"
        direction={{ base: "row", sm: "column" }}
        justify={"space-between"}
      >
        <Flex
          direction={{ base: "row", sm: "column" }}
          component="ul"
          className="accountnav__ul"
        >
          {Links.map((item, i) => (
            <AccountLink key={item.href} href={item.href} label={item.label} />
          ))}
        </Flex>
        <LogOutButton />
      </Flex>
    </Box>
  );
};

export default AccountNav;
