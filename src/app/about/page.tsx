import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about YouTube Transcripts — the free YouTube transcript generator.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          About YouTube Transcripts
        </h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <p>
            YouTube Transcripts is a free online tool that lets you extract,
            view, copy, and download transcripts from any YouTube video. Our
            mission is to make video content more accessible by providing fast,
            accurate transcript generation without requiring sign-ups or
            software installation.
          </p>
          <p>
            Our tool supports multiple export formats including TXT, SRT, VTT,
            PDF, and DOCX, and offers AI-powered summaries and translation
            for signed-in users. Whether you are a student, researcher,
            content creator, or someone who prefers reading over watching,
            YouTube Transcripts helps you get the text you need from any video.
          </p>
          <p>
            We are committed to keeping our core transcript generation service
            free and accessible to everyone.
          </p>
        </div>
      </div>
    </StaticPage>
  );
}
