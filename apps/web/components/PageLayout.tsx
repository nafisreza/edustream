"use client";

import { usePathname } from "next/navigation";
import SideNav from "./SideNav";
import Navbar from "./Navbar";

const noSideNavRoutes = ["/", "/login", "/signup"];

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSideNav = !noSideNavRoutes.includes(pathname);

  if (showSideNav) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <div className="flex flex-1 flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </div>
    );
  }

  // Landing page and auth pages render their own structure
  return <>{children}</>;
}
