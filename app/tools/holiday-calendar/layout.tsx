import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holiday Calendar 2025 | One TN Portal",
  description: "Tamil Nadu Government holidays list for 2025. விடுமுறை நாட்கள் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["TN holidays","government holidays","2025 calendar"],
  openGraph: {
    title: "Holiday Calendar 2025 | One TN Portal",
    description: "Tamil Nadu Government holidays list for 2025",
    type: "website",
  },
};

export default function HolidayCalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
