import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CasaLoop - Real Estate on Pi Network",
  description: "A professional real estate marketplace on the Pi Network. Buy, sell, and rent properties securely using Pi tokens",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "CasaLoop - Real Estate on Pi Network",
    description: "A professional real estate marketplace on the Pi Network. Buy, sell, and rent properties securely using Pi tokens",
  },
  twitter: {
    card: "summary_large_image",
    title: "CasaLoop - Real Estate on Pi Network",
    description: "A professional real estate marketplace on the Pi Network. Buy, sell, and rent properties securely using Pi tokens",
  },
    generator: 'v0.app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical domains for faster loading */}
        <link rel="preconnect" href="https://sdk.minepi.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://sdk.minepi.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        
        {/* Load Pi SDK with high priority */}
        <script src="https://sdk.minepi.com/pi-sdk.js" async></script>
      </head>
      <body className={inter.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
