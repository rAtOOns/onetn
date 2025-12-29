import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NPS Calculator | One TN Portal",
  description: "Calculate NPS corpus for employees who joined after 2003. NPS கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["NPS","National Pension System","new pension scheme"],
  openGraph: {
    title: "NPS Calculator | One TN Portal",
    description: "Calculate NPS corpus for employees who joined after 2003",
    type: "website",
  },
};

export default function NpsCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
