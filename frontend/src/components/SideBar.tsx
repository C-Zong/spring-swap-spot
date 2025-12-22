import Link from "next/link";
import { cookies } from "next/headers";
import NavLink from "./NavLink";
import { Compass } from "lucide-react";
import { LogIn } from "lucide-react";

export default async function Sidebar() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("auth");

  return (
    <nav
      className="flex flex-col gap-3 p-4 h-full
               transition-all duration-300 text-3xl"
    >

      <NavLink href="/">
        <Compass className="mr-2 inline" />Discover
      </NavLink>

      {!isLoggedIn && (
        <NavLink href="/login">
          <LogIn className="mr-2 inline" />Login
        </NavLink>
      )}

      {isLoggedIn && (
        <></>
      )}
    </nav>
  );
}
