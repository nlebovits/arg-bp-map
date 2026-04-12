import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asentamientos Informales | Argentina Building Footprints",
  description:
    "Explore informal settlements in Argentina and compare official RENABAP data with satellite-derived building footprints.",
  keywords: [
    "Argentina",
    "informal settlements",
    "asentamientos",
    "RENABAP",
    "building footprints",
    "urban planning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
