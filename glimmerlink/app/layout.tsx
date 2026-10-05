import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BRAND } from "@/lib/config";

const description =
  "Build a 3D birthday scene with their name, your message and your voice, and send it as one link. Opens in any browser.";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: `${BRAND.name}: Interactive 3D Birthday Surprise Links`,
    template: `%s | ${BRAND.name}`,
  },
  description,
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name}: Interactive 3D Birthday Surprise Links`,
    description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0f0720",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=Dancing+Script:wght@600;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
