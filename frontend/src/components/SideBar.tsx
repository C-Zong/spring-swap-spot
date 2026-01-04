import { cookies } from "next/headers";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
  const isLoggedIn = !!(await cookies()).get("token");
  return <SidebarClient isLoggedIn={isLoggedIn} />;
}
