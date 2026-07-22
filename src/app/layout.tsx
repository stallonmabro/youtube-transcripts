import type { Metadata } from "next";
import "./globals.css";
import { WebsiteJsonLd, SoftwareAppJsonLd } from "@/components/JsonLd";
import { AuthProvider } from "@/components/AuthProvider";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { ThemeProvider } from "@/components/ThemeProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://youtubetranscripts.com";

export const metadata: Metadata = {
  title: {
    default: "YouTube Transcript Generator — Free Video to Text Converter",
    template: "%s | YouTube Transcript Generator",
  },
  description:
    "Easily convert a YouTube video to transcript, copy and download the generated YouTube transcript in one click. Free YouTube transcript generator with timestamps, AI summaries, and multiple export formats.",
  keywords: [
    "youtube transcript generator",
    "youtube transcript",
    "youtube to text",
    "video transcript generator",
    "transcript generator",
    "youtube video transcript",
    "download youtube transcript",
    "youtube to text converter",
    "transcript youtube video",
    "free youtube transcript",
    "youtube caption extractor",
    "youtube subtitle downloader",
    "convert youtube to text",
    "youtube transcription tool",
    "ai youtube transcript",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "YouTube Transcript Generator — Free Video to Text Converter",
    description:
      "Easily convert a YouTube video to transcript, copy and download the generated YouTube transcript in one click. Free, no sign-up required.",
    url: "/",
    siteName: "YouTube Transcripts",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Transcript Generator — Free Video to Text Converter",
    description:
      "Easily convert a YouTube video to transcript, copy and download the generated YouTube transcript in one click.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5545114997623059" crossOrigin="anonymous" />
        <WebsiteJsonLd />
        <SoftwareAppJsonLd />
      </head>
      <body className="min-h-full flex flex-col">
          <ThemeProvider>
            <AuthProvider>
              {children}
              <KeyboardShortcuts />
            </AuthProvider>
          </ThemeProvider>
        </body>
    </html>
  );
}
