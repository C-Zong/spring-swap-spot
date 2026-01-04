"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
}

export default function NavLink({ href, onClick, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        rounded p-2 transition
        ${isActive 
          ? "bg-black/10 dark:bg-white/20" 
          : "hover:bg-black/5 dark:hover:bg-white/10"
        }
      `}
    >
      {children}
    </Link>
  );
}
