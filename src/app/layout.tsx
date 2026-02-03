import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PHP Playground - Online PHP IDE",
  description: "Write, run, and share PHP code instantly in your browser. No installation required. Perfect for learning, prototyping, and quick experiments.",
  keywords: ["PHP", "IDE", "online editor", "code playground", "web development", "programming"],
  authors: [{ name: "PHP Playground" }],
  openGraph: {
    title: "PHP Playground - Online PHP IDE",
    description: "Write, run, and share PHP code instantly in your browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-gray-900 text-white`}>
        {children}
      </body>
    </html>
  );
}
