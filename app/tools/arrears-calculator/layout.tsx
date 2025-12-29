import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DA Arrears Calculator | One TN Portal",
  description: "Calculate DA arrears when dearness allowance rate increases. நிலுவை கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["DA arrears","arrears calculation","backpay","TN arrears"],
  openGraph: {
    title: "DA Arrears Calculator | One TN Portal",
    description: "Calculate DA arrears when dearness allowance rate increases",
    type: "website",
  },
};

export default function ArrearsCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
