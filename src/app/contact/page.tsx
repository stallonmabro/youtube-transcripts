import type { Metadata } from "next";
import { Mail } from "lucide-react";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the YouTube Transcripts team.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Have questions, feedback, or suggestions? We would love to hear from
          you.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-surface/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <a
                href="mailto:hello@youtubetranscripts.com"
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                hello@youtubetranscripts.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </StaticPage>
  );
}
