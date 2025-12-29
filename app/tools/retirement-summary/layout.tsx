import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retirement Summary | One TN Portal",
  description: "One-page view of all retirement benefits including pension, gratuity, GPF. ஓய்வு சுருக்கம் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["retirement benefits","pension summary","gratuity","GPF"],
  openGraph: {
    title: "Retirement Summary | One TN Portal",
    description: "One-page view of all retirement benefits including pension, gratuity, GPF",
    type: "website",
  },
};

export default function RetirementSummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
