import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

export const metadata: Metadata = {
  title: "YouTube Subtitle Downloader — Free Online",
  description: "Download YouTube subtitles in SRT, VTT, and ASS formats. Free YouTube subtitle downloader — no sign-up required.",
};

const features = [
  "Download subtitles in SRT, VTT, and ASS formats",
  "Supports auto-generated and manual captions",
  "No upload needed — paste URL and download instantly",
];

const relatedTools = [
  { href: "/features/download-transcript", label: "Download Transcript", desc: "TXT, SRT, VTT, PDF, DOCX" },
  { href: "/features/transcript-extractor", label: "Transcript Extractor", desc: "Extract captions fast" },
  { href: "/features/video-summarizer", label: "Video Summarizer", desc: "AI-powered summaries" },
  { href: "/features/convert-to-text", label: "Convert to Text", desc: "Plain text conversion" },
];

export default function Page() {
  return (
    <FeaturePage
      title="YouTube Subtitle Downloader"
      description="Download YouTube subtitles in SRT, VTT, and ASS formats. Extract captions from any YouTube video with one click — free, fast, and no sign-up required."
      features={features}
      relatedTools={relatedTools}
    />
  );
}
