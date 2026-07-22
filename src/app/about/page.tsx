import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about YouTube Transcripts — the free YouTube transcript generator. Our mission, features, and commitment to accessibility.",
};

const whatWeDo = [
  { icon: "▸", label: "Transcript extraction", color: "bg-primary/10 text-primary" },
  { icon: "↓", label: "Multi-format export", color: "bg-emerald-50 text-emerald-500" },
  { icon: "⚡", label: "AI summaries (sign-in)", color: "bg-amber-50 text-amber-500" },
  { icon: "💬", label: "AI chat with transcripts (sign-in)", color: "bg-purple-50 text-purple-500" },
];

export default function Page() {
  return (
    <StaticPage
      breadcrumb={{ label: "About Us" }}
      sections={[
        { id: "mission", label: "Our Mission" },
        { id: "what-we-do", label: "What We Do" },
        { id: "free", label: "Free & Accessible" },
      ]}
    >
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        About YouTube Transcripts
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: July 21, 2026</p>

      <div className="mt-8 space-y-10 text-[15px] leading-relaxed text-foreground/85">
        <section id="mission">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Our Mission
          </h2>
          <p>
            YouTube Transcripts is a free online tool that lets you extract, view,
            copy, and download transcripts from any YouTube video. Our mission is to
            make video content more accessible by providing fast, accurate transcript
            generation without requiring sign-ups or software installation.
          </p>
          <p className="mt-3">
            Whether you&apos;re a <strong>student</strong> taking lecture notes, a{" "}
            <strong>researcher</strong> analyzing video content, a{" "}
            <strong>content creator</strong> repurposing material, or someone who
            simply <strong>prefers reading over watching</strong>, our transcript
            generator helps you get the text you need from any YouTube video —
            instantly.
          </p>
        </section>

        <section id="what-we-do">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            What We Do
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {whatWeDo.map(({ icon, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${color}`}
                >
                  {icon}
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="free">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Free &amp; Accessible
          </h2>
          <p>
            We believe transcript generation should be free. Everyone gets{" "}
            <strong>3 free transcripts per day</strong> without even creating an
            account. Sign in for <strong>100 transcripts per day</strong> plus access
            to AI summaries, translations, and premium export formats like PDF and
            DOCX.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
            <span className="text-2xl">🔒</span>
            <p className="text-sm leading-relaxed text-muted">
              Your privacy matters. All transcriptions are processed securely. We
              don&apos;t store video content — only metadata to power your dashboard
              and saved transcripts.
            </p>
          </div>
        </section>
      </div>
    </StaticPage>
  );
}
