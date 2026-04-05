"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Section } from "@/types/content";

interface RootChromeProps {
  children: React.ReactNode;
  sections: Section[];
  supervisorName?: string;
  editorInChiefName?: string;
}

export default function RootChrome({
  children,
  sections,
  supervisorName,
  editorInChiefName,
}: RootChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header
        sections={sections}
        supervisorName={supervisorName}
        editorInChiefName={editorInChiefName}
      />
      <main className="min-h-[60vh]">{children}</main>
      <Footer sections={sections} />
    </>
  );
}
