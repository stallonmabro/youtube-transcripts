import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

export const metadata: Metadata = {
  title: "YouTube Video Summarizer — AI-Powered Summaries",
  description: "Get instant AI summaries of any YouTube video. Extract key points, outlines, and takeaways in seconds with our free video summarizer.",
};

const features = [
  "AI-powered summaries in brief, detailed, or bullet-point format",
  "Extract key takeaways without watching the full video",
  "Free for signed-in users — export to PDF or DOCX",
];

const relatedTools = [
  { href: "/features/download-transcript", label: "Download Transcript", desc: "TXT, SRT, VTT, PDF, DOCX" },
  { href: "/features/subtitle-downloader", label: "Subtitle Downloader", desc: "SRT, VTT, ASS formats" },
  { href: "/features/transcript-extractor", label: "Transcript Extractor", desc: "Extract captions fast" },
  { href: "/features/convert-to-text", label: "Convert to Text", desc: "Plain text conversion" },
];

export default function Page() {
  return (
    <FeaturePage
      title="YouTube Video Summarizer"
      description="Get instant AI-powered summaries of any YouTube video. Extract key points, chapter outlines, and essential takeaways in seconds — brief, detailed, or bullet-point format."
      features={features}
      relatedTools={relatedTools}
    />
  );
}
