import {
  Sparkles,
  Shield,
  Zap,
  Monitor,
  Globe,
  Download,
  Clock,
  Search,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Free YouTube Transcript Generator",
    description:
      "Convert any YouTube video to text instantly. Get 3 free transcripts per day without an account, or sign in for up to 100 daily transcripts plus premium exports.",
  },
  {
    icon: Clock,
    title: "Timestamps with Every Transcript",
    description:
      "Every YouTube transcript includes precise timestamps. Click any timestamp to jump directly to that moment in the video for easy navigation.",
  },
  {
    icon: Download,
    title: "Export Transcripts in Multiple Formats",
    description:
      "Download your YouTube transcript as TXT, SRT, or VTT. Copy to clipboard with or without timestamps. Perfect for subtitles, captions, and notes.",
  },
  {
    icon: Search,
    title: "Search Within Transcripts",
    description:
      "Search through any YouTube transcript to find specific words or phrases instantly. Never waste time scrubbing through videos looking for key moments.",
  },
  {
    icon: Globe,
    title: "AI-Powered Video Summaries",
    description:
      "Get instant AI summaries of any YouTube video. Extract key points, outlines, and takeaways in seconds — brief, detailed, or bullet-point format.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your privacy matters. All transcriptions are processed securely with no personal data stored. Use our YouTube transcript generator with complete confidence.",
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="border-b border-border bg-surface py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Free YouTube Transcript Generator Features
          </h2>
          <p className="mt-4 text-muted">
            Everything you need to convert YouTube videos to text. Our{" "}
            <strong>transcript generator</strong> makes it fast, free, and
            accurate.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon size={20} />
              </div>
              <h3 className="font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
