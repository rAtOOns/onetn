import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator | One TN Portal",
  description: "Calculate exact age in years, months, and days for admissions and records. வயது கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["age calculator","date of birth","exact age"],
  openGraph: {
    title: "Age Calculator | One TN Portal",
    description: "Calculate exact age in years, months, and days for admissions and records",
    type: "website",
  },
};

export default function AgeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
