import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Working Days Counter | One TN Portal",
  description: "Count working days excluding weekends and holidays. பணி நாட்கள் கணக்கு - Free online calculator for Tamil Nadu government employees.",
  keywords: ["working days","business days","exclude holidays"],
  openGraph: {
    title: "Working Days Counter | One TN Portal",
    description: "Count working days excluding weekends and holidays",
    type: "website",
  },
};

export default function WorkingDaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
