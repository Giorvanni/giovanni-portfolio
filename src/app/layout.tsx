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
  title: "Giovanni Bagmeijer | AI Automation Engineer",
  description:
    "AI Automation Engineer specializing in AI-driven systems, React, Next.js, and workflow automation. Building intelligent tools and scalable platforms.",
  keywords: [
    "AI Automation Engineer",
    "AI",
    "React",
    "Next.js",
    "TypeScript",
    "Full Stack Developer",
    "Giovanni Bagmeijer",
  ],
  metadataBase: new URL("https://giovanni-portfolio-eta.vercel.app"),
  openGraph: {
    title: "Giovanni Bagmeijer | AI Automation Engineer",
    description:
      "AI Automation Engineer specializing in AI-driven systems, React, Next.js, and workflow automation.",
    type: "website",
    url: "https://giovanni-portfolio-eta.vercel.app",
    siteName: "Giovanni Bagmeijer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giovanni Bagmeijer | AI Automation Engineer",
    description:
      "AI Automation Engineer specializing in AI-driven systems, React, Next.js, and workflow automation.",
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
              jobTitle: "AI Automation Engineer",
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
