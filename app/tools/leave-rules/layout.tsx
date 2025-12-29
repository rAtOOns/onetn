import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave Rules | One TN Portal",
  description: "Quick reference for TN government leave entitlements and rules. விடுப்பு விதிகள் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["leave rules","leave entitlement","TN leave policy"],
  openGraph: {
    title: "Leave Rules | One TN Portal",
    description: "Quick reference for TN government leave entitlements and rules",
    type: "website",
  },
};

export default function LeaveRulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
