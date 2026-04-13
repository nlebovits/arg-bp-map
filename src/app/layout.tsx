import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Barrios Visibles | Argentina",
  description:
    "Explore informal settlements in Argentina and compare official RENABAP data with satellite-derived building footprints.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="h-full font-sans">{children}</body>
    </html>
  );
}
