import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Calculator | One TN Portal",
  description: "Calculate TN Government employee salary with 7th Pay Commission, DA, HRA, and all allowances. சம்பள கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["TN salary calculator", "7th pay commission", "DA calculator", "HRA calculator", "Tamil Nadu salary", "government salary", "சம்பள கால்குலேட்டர்"],
  openGraph: {
    title: "Salary Calculator | One TN Portal",
    description: "Calculate TN Government employee salary with 7th Pay Commission, DA, HRA, and all allowances",
    type: "website",
  },
};

export default function SalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
