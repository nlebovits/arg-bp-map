import type { Metadata } from "next";
import "./globals.css";

// Base URL for absolute URLs in metadata (OG images, canonical, etc.)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://barriosvisibles.ar";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Barrios Visibles | Argentina",
    template: "%s | Barrios Visibles",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Root layout passes through to [locale]/layout.tsx which handles html/body
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
