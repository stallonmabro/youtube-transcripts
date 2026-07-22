import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

export const metadata: Metadata = {
  title: "YouTube Transcript Extractor — Extract Captions Fast",
  description: "Extract transcripts from any YouTube video instantly. Our free YouTube transcript extractor gives you full text with timestamps.",
};

const features = [
  "Extract complete transcripts with timestamps",
  "Supports all YouTube caption languages",
  "Copy to clipboard or download in multiple formats",
];

const relatedTools = [
  { href: "/features/download-transcript", label: "Download Transcript", desc: "TXT, SRT, VTT, PDF, DOCX" },
  { href: "/features/subtitle-downloader", label: "Subtitle Downloader", desc: "SRT, VTT, ASS formats" },
  { href: "/features/video-summarizer", label: "Video Summarizer", desc: "AI-powered summaries" },
  { href: "/features/convert-to-text", label: "Convert to Text", desc: "Plain text conversion" },
];

export default function Page() {
  return (
    <FeaturePage
      title="YouTube Transcript Extractor"
      description="Extract complete transcripts from any YouTube video instantly. Get full text with precise timestamps, search within the transcript, and export in any format you need."
      features={features}
      relatedTools={relatedTools}
    />
  );
}
