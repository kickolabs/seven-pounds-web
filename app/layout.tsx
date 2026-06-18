
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
