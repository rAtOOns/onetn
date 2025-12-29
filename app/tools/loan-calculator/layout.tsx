import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPF/Loan Calculator | One TN Portal",
  description: "Calculate GPF balance and loan eligibility. GPF கடன் கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["GPF loan","provident fund loan","loan eligibility"],
  openGraph: {
    title: "GPF/Loan Calculator | One TN Portal",
    description: "Calculate GPF balance and loan eligibility",
    type: "website",
  },
};

export default function LoanCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
