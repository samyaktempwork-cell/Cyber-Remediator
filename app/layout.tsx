import type { Metadata } from "next";
import "./globals.css";

// REMOVED: import { Inter } from "next/font/google"; 
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cyber Remediator | Aegis Vizier Protocol",
  description: "Identity Exposure & Vulnerability Scanner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Removed {inter.className} */}
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}