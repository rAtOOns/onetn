import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  ConditionalHeader,
  ConditionalFooter,
  ConditionalSkipLinks,
} from "@/components/layout/ConditionalLayout";
import InstallPrompt from "@/components/pwa/InstallPrompt";

export const metadata: Metadata = {
  title: "One TN Portal | ஒரே தமிழ்நாடு",
  description:
    "A portal for Tamil Nadu citizens to access documents, forms, GOs, circulars, schemes, and news. தமிழ்நாடு குடிமக்களுக்கான இணையதளம்.",
  keywords: [
    "Tamil Nadu",
    "TN",
    "One TN",
    "Documents",
    "GO",
    "Circulars",
    "Forms",
    "Schemes",
    "தமிழ்நாடு",
    "அரசாணைகள்",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "One TN",
  },
  openGraph: {
    title: "One TN Portal",
    description: "Access documents, forms, and news for Tamil Nadu",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
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
      <body className="min-h-screen flex flex-col bg-tn-background">
        <ConditionalSkipLinks />
        <ConditionalHeader />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <ConditionalFooter />
        <InstallPrompt />
      </body>
    </html>
  );
}
