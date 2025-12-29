import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pension Calculator | One TN Portal",
  description: "Calculate monthly pension, commutation, and family pension for TN employees. ஓய்வூதிய கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["pension","commutation","family pension","retirement"],
  openGraph: {
    title: "Pension Calculator | One TN Portal",
    description: "Calculate monthly pension, commutation, and family pension for TN employees",
    type: "website",
  },
};

export default function PensionCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
