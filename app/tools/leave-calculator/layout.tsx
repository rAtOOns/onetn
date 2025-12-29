import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave Balance Calculator | One TN Portal",
  description: "Track and calculate CL, EL, ML and other leave balances. விடுப்பு நிலுவை கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["leave balance","CL","EL","ML","casual leave","earned leave"],
  openGraph: {
    title: "Leave Balance Calculator | One TN Portal",
    description: "Track and calculate CL, EL, ML and other leave balances",
    type: "website",
  },
};

export default function LeaveCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
