import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Surrender Leave Calculator | One TN Portal",
  description: "Calculate surrender leave encashment amount. விடுப்பு சரண் கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["surrender leave","leave encashment","surrender EL"],
  openGraph: {
    title: "Surrender Leave Calculator | One TN Portal",
    description: "Calculate surrender leave encashment amount",
    type: "website",
  },
};

export default function SurrenderLeaveCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
