import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Giovanni Bagmeijer | Full Stack Developer",
  description:
    "Full Stack Web Developer specializing in React, Next.js, data architecture, and AI integration. Building scalable digital platforms and intelligence systems.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Web Developer",
    "Giovanni Bagmeijer",
  ],
  openGraph: {
    title: "Giovanni Bagmeijer | Full Stack Developer",
    description:
      "Full Stack Web Developer specializing in React, Next.js, data architecture, and AI integration.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
