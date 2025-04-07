import Link from "next/link";

const NavLogo = () => {
  return (
    <Link href={"/"} title="logo" className="header__logo--link">
      <picture>
        <source
          media="(max-width: 969px)"
          srcSet="/logo_small.svg"
          loading="lazy"
        />
        <source media="(min-width: 970px)" srcSet="/logo.svg" loading="lazy" />
        <img src="/asset/logo.svg" alt="logo" title="Back to homepage" />
      </picture>
    </Link>
  );
};

export default NavLogo;
