import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, label, vp }) => {
  const pathname = usePathname();

  const isActive = pathname === href || pathname?.startsWith(`${href}/`);
  return (
    <li className={`navbar-${vp}__list-item`}>
      <Link
        href={href}
        className={` navbar-link-global navbar-${vp}__link-${vp} ${
          isActive && "active"
        }`}
      >
        {label}
      </Link>
    </li>
  );
};

export default NavLink;
