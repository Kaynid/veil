import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VEIL. — Reveal What You're Wearing",
  description:
    "A digital exhibition exploring fashion through interaction. Every collection begins hidden. Every movement uncovers another layer.",
  keywords: ["fashion", "design studio", "exhibition", "interactive", "VEIL"],
  openGraph: {
    title: "VEIL. — Reveal What You're Wearing",
    description:
      "A digital exhibition exploring fashion through interaction.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
