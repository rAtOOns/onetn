import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Income Tax Calculator | One TN Portal",
  description: "Compare Old vs New tax regime for TN government employees. வருமான வரி கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["income tax","tax regime","old vs new tax","section 80C"],
  openGraph: {
    title: "Income Tax Calculator | One TN Portal",
    description: "Compare Old vs New tax regime for TN government employees",
    type: "website",
  },
};

export default function IncomeTaxCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
