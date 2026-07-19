import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://youtubetranscripts.com";

const staticPages = [
  "",
  "/features/download-transcript",
  "/features/video-summarizer",
  "/features/subtitle-downloader",
  "/features/transcript-extractor",
  "/features/convert-to-text",
  "/srt-to-vtt",
  "/srt-to-txt",
  "/srt-to-ass",
  "/open-srt-file",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/dashboard",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticPages.map((page) => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "weekly" : ("monthly" as const),
    priority: page === "" ? 1 : 0.8,
  }));
}
