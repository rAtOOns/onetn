import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gratuity Calculator | One TN Portal",
  description: "Calculate gratuity amount based on service and last pay drawn. நன்கொடை கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["gratuity","retirement benefit","service gratuity"],
  openGraph: {
    title: "Gratuity Calculator | One TN Portal",
    description: "Calculate gratuity amount based on service and last pay drawn",
    type: "website",
  },
};

export default function GratuityCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
