import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPF Interest Calculator | One TN Portal",
  description: "Calculate yearly GPF interest with monthly breakdown. GPF வட்டி கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["GPF interest","GPF rate","provident fund interest"],
  openGraph: {
    title: "GPF Interest Calculator | One TN Portal",
    description: "Calculate yearly GPF interest with monthly breakdown",
    type: "website",
  },
};

export default function GpfInterestCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
