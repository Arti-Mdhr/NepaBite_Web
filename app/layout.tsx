import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecipeFinder",
  description: "Find recipes, create grocery lists, and locate nearby marts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-serif bg-white">
        {children}
      </body>
    </html>
  );
}
