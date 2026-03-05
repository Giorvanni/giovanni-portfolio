import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
  metadataBase: new URL("https://giovanni-portfolio-eta.vercel.app"),
  openGraph: {
    title: "Giovanni Bagmeijer | Full Stack Developer",
    description:
      "Full Stack Web Developer specializing in React, Next.js, data architecture, and AI integration.",
    type: "website",
    url: "https://giovanni-portfolio-eta.vercel.app",
    siteName: "Giovanni Bagmeijer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giovanni Bagmeijer | Full Stack Developer",
    description:
      "Full Stack Web Developer specializing in React, Next.js, data architecture, and AI integration.",
  },
  alternates: {
    canonical: "https://giovanni-portfolio-eta.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Giovanni Bagmeijer",
              jobTitle: "Full Stack Developer",
              url: "https://giovanni-portfolio-eta.vercel.app",
              email: "g.bagmeijer@gmail.com",
              telephone: "+31645073445",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nijmegen",
                addressCountry: "NL",
              },
              sameAs: [
                "https://www.linkedin.com/in/giovanni-bagmeijer-8744aa186/",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Bright Technology Ventures",
              },
              knowsAbout: [
                "React",
                "Next.js",
                "TypeScript",
                "Node.js",
                "PostgreSQL",
                "Python",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <a
          href="#main"
          className="fixed left-4 top-4 z-[10001] -translate-y-20 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-black shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
