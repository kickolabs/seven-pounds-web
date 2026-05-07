
import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import { SITE_METADATA } from "@/lib/constants";
import LenisProvider from "@/components/shared/LenisProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: `${SITE_METADATA.name} — ${SITE_METADATA.tagline}`,
    template: `%s | ${SITE_METADATA.name}`,
  },
  description: SITE_METADATA.description,
  metadataBase: new URL(SITE_METADATA.url),
  alternates: {
    canonical: SITE_METADATA.url,
  },
  openGraph: {
    title: `${SITE_METADATA.name} — ${SITE_METADATA.tagline}`,
    description: SITE_METADATA.description,
    url: SITE_METADATA.url,
    siteName: SITE_METADATA.name,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_METADATA.name} — ${SITE_METADATA.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_METADATA.name} — ${SITE_METADATA.tagline}`,
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
        <LenisProvider>
          {children}
        </LenisProvider>
<Toaster />
      </body>
    </html>
  );
}
