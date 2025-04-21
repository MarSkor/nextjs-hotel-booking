import Link from "next/link";
import { Box } from "@mantine/core";

const NavbarLogo = () => {
  return (
    <Box className="navbar__logo">
      <Link href={"/"} title="logo" className="navbar__logo--link">
        <picture>
          <source
            media="(max-width: 969px)"
            srcSet="/assets/logo/logo_small.svg"
            loading="lazy"
          />
          <source
            media="(min-width: 970px)"
            srcSet="/assets/logo/logo.svg"
            loading="lazy"
          />
          <img
            src="/assets/logo/logo.svg"
            alt="logo"
            title="Back to homepage"
          />
        </picture>
      </Link>
    </Box>
  );
};

export default NavbarLogo;
