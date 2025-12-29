import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DA Rate Table | One TN Portal",
  description: "Current and historical Dearness Allowance rates for Tamil Nadu from 2001. அகவிலைப்படி விகிதம் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["DA rate","dearness allowance","DA history","DA percentage","TN DA"],
  openGraph: {
    title: "DA Rate Table | One TN Portal",
    description: "Current and historical Dearness Allowance rates for Tamil Nadu from 2001",
    type: "website",
  },
};

export default function DaRatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
