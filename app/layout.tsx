
import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import { SITE_METADATA } from "@/lib/constants";
import LenisProvider from "@/components/shared/LenisProvider";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";
import { Toaster } from "@/components/ui/toaster";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: SITE_METADATA.name,
  description: SITE_METADATA.description,
  url: SITE_METADATA.url,
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  currenciesAccepted: "INR",
  priceRange: "₹₹",
  serviceType: [
    "Debt Relief Solutions",
    "EMI Optimization",
    "Financial Advisory",
    "Fintech Management Services",
    "Financial Stability Planning",
  ],
};

export const metadata: Metadata = {
  title: {
    default: "The Seven Pounds | Debt Relief & Fintech Management Services",
    template: `%s | ${SITE_METADATA.name}`,
  },
  description: SITE_METADATA.description,
  metadataBase: new URL(SITE_METADATA.url),
  manifest: "/manifest.json?v=2",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png?v=2", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-touch-icon.png?v=2",
  },
  alternates: {
    canonical: SITE_METADATA.url,
  },
  openGraph: {
    title: "The Seven Pounds | Debt Relief & Fintech Management Services",
    description: SITE_METADATA.description,
    url: SITE_METADATA.url,
    siteName: SITE_METADATA.name,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Seven Pounds | Debt Relief & Fintech Management Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Seven Pounds | Debt Relief & Fintech Management Services",
    description: SITE_METADATA.description,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider>
          {children}
        </LenisProvider>
        <FloatingWhatsApp />
        <Toaster />
      </body>
    </html>
  );
}
