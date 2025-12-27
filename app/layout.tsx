import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nepabite",
  description: "Recipe finder app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white antialiased font-serif">{children}</body>
    </html>
  );
}
