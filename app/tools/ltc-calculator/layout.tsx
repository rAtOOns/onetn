import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LTC Calculator | One TN Portal",
  description: "Calculate Leave Travel Concession benefits. LTC கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["LTC","leave travel concession","travel allowance"],
  openGraph: {
    title: "LTC Calculator | One TN Portal",
    description: "Calculate Leave Travel Concession benefits",
    type: "website",
  },
};

export default function LtcCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
