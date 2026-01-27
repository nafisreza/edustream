"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const noNavbarRoutes = ["/"];

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = !noNavbarRoutes.includes(pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "pt-16" : undefined}>{children}</main>
    </div>
  );
}
