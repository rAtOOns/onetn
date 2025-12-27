"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import SkipLinks from "./SkipLinks";

export function ConditionalHeader() {
  const pathname = usePathname();

  // Don't show header on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}

export function ConditionalSkipLinks() {
  const pathname = usePathname();

  // Don't show skip links on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <SkipLinks />;
}
