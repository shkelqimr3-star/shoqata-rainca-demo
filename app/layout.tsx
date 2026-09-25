import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shoqata Rainca",
  description: "Faqja zyrtare e Shoqatës Rainca – aktivitete, projekte, anëtarësi dhe transparencë."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}
