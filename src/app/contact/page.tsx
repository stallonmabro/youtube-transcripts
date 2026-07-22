import type { Metadata } from "next";
import { Mail, Clock, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the YouTube Transcripts team. We respond within 24 hours.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          {/* Page header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Get in Touch
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-base text-muted">
              Have a question, suggestion, or need help with YouTube transcripts?
              We&apos;d love to hear from you.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-[1fr_300px]">
            {/* Contact Form */}
            <ContactForm />

            {/* Sidebar info */}
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Email</div>
                    <a
                      href="mailto:hello@etranscripts.com.ng"
                      className="text-sm text-muted transition-colors hover:text-primary"
                    >
                      hello@etranscripts.com.ng
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Response Time</div>
                    <div className="text-sm text-muted">Within 24 hours</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-base font-semibold text-foreground">Before you write&hellip;</h3>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                  <li className="flex gap-2">
                    <ArrowRight size={14} className="mt-1 shrink-0 text-primary" />
                    Check our <a href="/#faq" className="ml-0.5 font-medium text-primary hover:underline">FAQ</a> for instant answers
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight size={14} className="mt-1 shrink-0 text-primary" />
                    Transcript issues? Include the video URL
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight size={14} className="mt-1 shrink-0 text-primary" />
                    Feature idea? Tell us your use case
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
