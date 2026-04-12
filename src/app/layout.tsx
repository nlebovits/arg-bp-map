// Root layout - fonts and styles are defined here, actual html/body in [locale]/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
