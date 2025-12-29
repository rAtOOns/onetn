import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TPF Calculator | One TN Portal",
  description: "Calculate Tamil Nadu Provident Fund interest and generate statement. TPF கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["TPF","provident fund","GPF","PF interest"],
  openGraph: {
    title: "TPF Calculator | One TN Portal",
    description: "Calculate Tamil Nadu Provident Fund interest and generate statement",
    type: "website",
  },
};

export default function TpfCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
