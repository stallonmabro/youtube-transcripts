import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

export const metadata: Metadata = {
  title: "Convert YouTube to Text — Free Online Converter",
  description: "Convert any YouTube video to plain text instantly. Free YouTube to text converter with timestamps — no sign-up required.",
};

const features = [
  "Convert YouTube videos to plain text in seconds",
  "Copy full transcript or download as TXT",
  "Works with auto-generated and manual captions",
];

const relatedTools = [
  { href: "/features/download-transcript", label: "Download Transcript", desc: "TXT, SRT, VTT, PDF, DOCX" },
  { href: "/features/transcript-extractor", label: "Transcript Extractor", desc: "Extract captions fast" },
  { href: "/features/subtitle-downloader", label: "Subtitle Downloader", desc: "SRT, VTT, ASS formats" },
  { href: "/features/video-summarizer", label: "Video Summarizer", desc: "AI-powered summaries" },
];

export default function Page() {
  return (
    <FeaturePage
      title="Convert YouTube to Text"
      description="Convert any YouTube video to plain text instantly. Get the full transcript as readable text — free, fast, and no sign-up required. Copy to clipboard or download."
      features={features}
      relatedTools={relatedTools}
    />
  );
}
