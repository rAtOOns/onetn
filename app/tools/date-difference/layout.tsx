import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Date Difference Calculator | One TN Portal",
  description: "Calculate days, months, and years between two dates. தேதி வேறுபாடு கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["date difference","days between dates","date calculator"],
  openGraph: {
    title: "Date Difference Calculator | One TN Portal",
    description: "Calculate days, months, and years between two dates",
    type: "website",
  },
};

export default function DateDifferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
