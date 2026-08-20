import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIBARA — Bank Regulasi Dana BOSP",
  description:
    "Sistem Informasi Bank Regulasi Dana BOSP Berbasis Digital — Inspektorat Kabupaten Sumba Barat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-muted text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
