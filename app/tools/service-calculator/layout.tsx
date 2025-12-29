import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Calculator | One TN Portal",
  description: "Calculate total service period and retirement date. பணிக்கால கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["service period","qualifying service","retirement date"],
  openGraph: {
    title: "Service Calculator | One TN Portal",
    description: "Calculate total service period and retirement date",
    type: "website",
  },
};

export default function ServiceCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
