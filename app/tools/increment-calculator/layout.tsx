import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Increment Calculator | One TN Portal",
  description: "Calculate next increment date and amount for TN government employees. ஊதிய உயர்வு கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["annual increment","3% increment","increment date","TN increment"],
  openGraph: {
    title: "Increment Calculator | One TN Portal",
    description: "Calculate next increment date and amount for TN government employees",
    type: "website",
  },
};

export default function IncrementCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
