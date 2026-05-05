import type { Metadata } from "next";
import "./globals.css";

const title = "Shoqata Rainca – Bashkë për Raincën";
const description = "Platformë moderne për transparencë, anëtarësim, projekte dhe mbështetje për mirëqenien e Raincës.";
const image = "/uploads/rainca-aerial.jpg";

export const metadata: Metadata = {
  metadataBase: new URL("https://shoqata-rainca.ch"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: image,
        alt: "Shoqata Rainca – Bashkë për Raincën"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image]
  }
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
