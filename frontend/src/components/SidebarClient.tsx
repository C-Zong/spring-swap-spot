"use client";

import NavLink from "./NavLink";
import {
  Compass, LogIn, ShoppingCart,
  MessageCircle, User, LogOut,
} from "lucide-react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function SidebarClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post("/api/logout", {});
    router.push("/");
    router.refresh();
  };

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
        <>
          <NavLink href="/cart">
            <ShoppingCart className="mr-2 inline" />
            Cart
          </NavLink>

          <NavLink href="/messages">
            <MessageCircle className="mr-2 inline" />
            Messages
          </NavLink>

          <NavLink href="/me">
            <User className="mr-2 inline" />
            My Space
          </NavLink> 

          <NavLink href="#" onClick={e => { e.preventDefault(); handleLogout(); }}>
            <LogOut className="mr-2 inline" />
            Sign Out
          </NavLink>
        </>
      )}
    </nav>
  );
}