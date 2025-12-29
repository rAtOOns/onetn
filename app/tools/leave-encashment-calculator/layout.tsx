import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave Encashment Calculator | One TN Portal",
  description: "Calculate EL and HPL encashment amount at retirement. விடுப்பு பணமாக்கல் கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["leave encashment","EL encashment","HPL","earned leave"],
  openGraph: {
    title: "Leave Encashment Calculator | One TN Portal",
    description: "Calculate EL and HPL encashment amount at retirement",
    type: "website",
  },
};

export default function LeaveEncashmentCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
