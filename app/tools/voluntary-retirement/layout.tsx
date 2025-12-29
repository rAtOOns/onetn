import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voluntary Retirement Calculator | One TN Portal",
  description: "Calculate VRS benefits and eligibility for voluntary retirement. தன்னார்வ ஓய்வு கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["VRS","voluntary retirement","early retirement"],
  openGraph: {
    title: "Voluntary Retirement Calculator | One TN Portal",
    description: "Calculate VRS benefits and eligibility for voluntary retirement",
    type: "website",
  },
};

export default function VoluntaryRetirementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
