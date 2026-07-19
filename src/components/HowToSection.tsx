import { Link as LinkIcon, FileText, Download } from "lucide-react";
import { HowToJsonLd } from "./JsonLd";

const steps = [
  {
    icon: LinkIcon,
    number: "1",
    title: "Copy the YouTube Video URL",
    description:
      "Copy the YouTube video URL you want to transcribe. Works with regular videos, Shorts, and private videos you have access to.",
  },
  {
    icon: FileText,
    number: "2",
    title: "Paste & Generate Transcript",
    description:
      "Paste the URL into our YouTube transcript generator and click 'Generate Transcript'. Our tool extracts the transcript in seconds.",
  },
  {
    icon: Download,
    number: "3",
    title: "Copy or Download Your Transcript",
    description:
      "View your transcript with timestamps. Copy to clipboard, download as TXT/SRT/VTT, or generate an AI summary of the video content.",
  },
];

export default function HowToSection() {
  return (
    <section id="how-to" className="border-b border-border py-20">
      <HowToJsonLd
        steps={steps.map((s) => ({
          title: s.title,
          description: s.description,
        }))}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            How to Use Our YouTube Transcript Generator
          </h2>
          <p className="mt-4 text-muted">
            Generate a YouTube transcript in three simple steps. No account
            needed, no credit card required.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon size={24} />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 sm:left-[calc(50%+2rem)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
