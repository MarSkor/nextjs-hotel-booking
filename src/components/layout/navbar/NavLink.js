"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, text }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`header__link ${isActive ? "active" : ""}`}>
      {text}
    </Link>
  );
};

export default NavLink;
