import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

export const metadata: Metadata = {
  title: "Download YouTube Transcript",
  description:
    "Download YouTube transcripts in TXT, SRT, VTT, PDF, and DOCX formats. Copy any transcript with timestamps in one click.",
};

const features = [
  "Download with or without timestamps",
  "Export to TXT, SRT, VTT, PDF, DOCX",
  "Works on any device — no software needed",
];

const relatedTools = [
  { href: "/features/video-summarizer", label: "Video Summarizer", desc: "AI-powered summaries" },
  { href: "/features/subtitle-downloader", label: "Subtitle Downloader", desc: "SRT, VTT, ASS formats" },
  { href: "/features/transcript-extractor", label: "Transcript Extractor", desc: "Extract captions fast" },
  { href: "/features/convert-to-text", label: "Convert to Text", desc: "Plain text conversion" },
];

export default function Page() {
  return (
    <FeaturePage
      title="Download YouTube Transcript"
      description="Download any YouTube video transcript in TXT, SRT, VTT, PDF, or DOCX format. Our free YouTube transcript downloader works instantly — just paste a URL."
      features={features}
      relatedTools={relatedTools}
    />
  );
}
