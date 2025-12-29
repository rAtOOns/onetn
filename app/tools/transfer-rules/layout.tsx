import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transfer Rules & Process | One TN Portal",
  description: "Transfer counseling process and rules guide for TN education department. இடமாற்ற விதிகள் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["transfer","posting","counseling","transfer rules"],
  openGraph: {
    title: "Transfer Rules & Process | One TN Portal",
    description: "Transfer counseling process and rules guide for TN education department",
    type: "website",
  },
};

export default function TransferRulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
