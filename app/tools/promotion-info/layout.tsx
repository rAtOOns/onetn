import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotion Information | One TN Portal",
  description: "Promotion hierarchy, eligibility and requirements for TN education department. பதவி உயர்வு தகவல் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["promotion","career progression","eligibility"],
  openGraph: {
    title: "Promotion Information | One TN Portal",
    description: "Promotion hierarchy, eligibility and requirements for TN education department",
    type: "website",
  },
};

export default function PromotionInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
