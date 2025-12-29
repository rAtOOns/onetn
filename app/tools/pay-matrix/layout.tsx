import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pay Matrix Lookup | One TN Portal",
  description: "7th Pay Commission Pay Matrix table lookup for Tamil Nadu Government employees. சம்பள அட்டவணை - Free online calculator for Tamil Nadu government employees.",
  keywords: ["pay matrix","7th CPC","pay scale","pay level","TN pay matrix"],
  openGraph: {
    title: "Pay Matrix Lookup | One TN Portal",
    description: "7th Pay Commission Pay Matrix table lookup for Tamil Nadu Government employees",
    type: "website",
  },
};

export default function PayMatrixLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
