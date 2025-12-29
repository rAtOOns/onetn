import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  ConditionalHeader,
  ConditionalFooter,
  ConditionalSkipLinks,
} from "@/components/layout/ConditionalLayout";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import StructuredData from "@/components/seo/StructuredData";
import { ToastProvider } from "@/components/ui/toast";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://onetn-portal-734553869592.asia-south1.run.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "One TN Portal | Tamil Nadu Education Department Resources",
    template: "%s | One TN Portal",
  },
  description:
    "Unofficial portal for Tamil Nadu Education Department employees - Access GOs, salary calculators, pension tools, DA rates, leave rules, and more. தமிழ்நாடு கல்வித்துறை ஊழியர்களுக்கான வளங்கள்.",
  keywords: [
    "Tamil Nadu Education Department",
    "TN Teacher Salary Calculator",
    "DA Rate Tamil Nadu",
    "7th Pay Commission Tamil Nadu",
    "TN Government Orders",
    "Teacher Pension Calculator",
    "GPF Calculator Tamil Nadu",
    "Leave Rules TN",
    "Pay Matrix Tamil Nadu",
    "TN Education GO",
    "தமிழ்நாடு கல்வித்துறை",
    "அரசாணைகள்",
    "சம்பள கால்குலேட்டர்",
    "ஓய்வூதிய கால்குலேட்டர்",
    "அகவிலைப்படி",
  ],
  authors: [{ name: "One TN Portal Community" }],
  creator: "One TN Portal",
  publisher: "One TN Portal",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "One TN Portal",
  },
  openGraph: {
    title: "One TN Portal | Tamil Nadu Education Department Resources",
    description: "Salary calculators, pension tools, DA rates, GOs and more for TN Education Department employees",
    url: siteUrl,
    siteName: "One TN Portal",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "One TN Portal - Tamil Nadu Education Department Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "One TN Portal | TN Education Resources",
    description: "Salary calculators, pension tools, DA rates and more for TN Education employees",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Education",
  other: {
    "mobile-web-app-capable": "yes",
    "google-site-verification": "your-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#065f46",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className="min-h-screen flex flex-col bg-tn-background">
        <ToastProvider>
          <ConditionalSkipLinks />
          <ConditionalHeader />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <ConditionalFooter />
          <InstallPrompt />
        </ToastProvider>
      </body>
    </html>
  );
}
