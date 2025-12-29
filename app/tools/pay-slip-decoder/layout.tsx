import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pay Slip Decoder | One TN Portal",
  description: "Understand each component of your TN government pay slip. சம்பள சீட்டு விளக்கி - Free online calculator for Tamil Nadu government employees.",
  keywords: ["pay slip","salary slip","pay components","deductions"],
  openGraph: {
    title: "Pay Slip Decoder | One TN Portal",
    description: "Understand each component of your TN government pay slip",
    type: "website",
  },
};

export default function PaySlipDecoderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
