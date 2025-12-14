import React from 'react';
import './globals.css';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: 'Cyber Remediator | Aegis Vizier Protocol',
  description: 'Identity Exposure & Vulnerability Scanner',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* VERCEL OBSERVABILITY TOOLS */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}