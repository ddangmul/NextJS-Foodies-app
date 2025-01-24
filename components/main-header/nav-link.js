"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./nav-link.module.css";

export default function NavLink({ href, children }) {
  // // 네비 조건부 활성화 위해 현재 할동경로 파악
  const path = usePathname();
  return (
    <Link
      href={href}
      className={
        path.startsWith(href)
          ? `${classes.active} ${classes.link}`
          : classes.link
      }
    >
      {children}
    </Link>
  );
}
