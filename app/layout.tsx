import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shoqata Rainca - Demo",
  description: "Demo/proposal website for Shoqata Rainca, built for board review."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}
