import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pay Fixation Calculator | One TN Portal",
  description: "Calculate pay fixation on promotion, MACP, or grade change. ஊதிய நிர்ணய கால்குலேட்டர் - Free online calculator for Tamil Nadu government employees.",
  keywords: ["pay fixation","promotion pay","MACP","grade pay"],
  openGraph: {
    title: "Pay Fixation Calculator | One TN Portal",
    description: "Calculate pay fixation on promotion, MACP, or grade change",
    type: "website",
  },
};

export default function PayFixationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
