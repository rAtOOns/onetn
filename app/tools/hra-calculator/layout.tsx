import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HRA Exemption Calculator | One TN Portal",
  description: "Calculate HRA tax exemption under Section 10(13A). HRA விலக்கு கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["HRA exemption","house rent allowance","section 10(13A)"],
  openGraph: {
    title: "HRA Exemption Calculator | One TN Portal",
    description: "Calculate HRA tax exemption under Section 10(13A)",
    type: "website",
  },
};

export default function HraCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
