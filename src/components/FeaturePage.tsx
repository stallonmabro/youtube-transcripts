import { ArrowRight, Check } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import HeroInput from "./HeroInput";

interface FeaturePageProps {
  title: string;
  description: string;
  features: string[];
  relatedTools: { href: string; label: string; desc: string }[];
}

export default function FeaturePage({
  title,
  description,
  features,
  relatedTools,
}: FeaturePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-surface to-background py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
              <div className="flex-1">
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  <Check size={12} />
                  Free tool
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
                  {description}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shrink-0">
                        <Check size={14} strokeWidth={2.5} />
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden h-56 w-80 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-sm text-muted lg:flex">
                🎬 Tool illustration
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to get started?
          </h2>
          <p className="mt-2 text-sm text-muted">
            Paste a YouTube URL and get started instantly — no sign-up required.
          </p>
          <div className="mx-auto mt-6 max-w-xl px-4">
            <HeroInput />
          </div>
        </section>

        {/* Related Tools */}
        <section className="border-t border-border bg-surface py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              More Tools
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTools.map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {tool.label}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">{tool.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
