const footerLinks = [
  {
    title: "Features",
    links: [
      { label: "YouTube Transcript Generator", href: "/" },
      { label: "Download YouTube Transcript", href: "/features/download-transcript" },
      { label: "YouTube Video Summarizer", href: "/features/video-summarizer" },
      { label: "YouTube Subtitle Downloader", href: "/features/subtitle-downloader" },
      { label: "YouTube Transcript Extractor", href: "/features/transcript-extractor" },
      { label: "Convert YouTube to Text", href: "/features/convert-to-text" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "SRT to VTT Converter", href: "/srt-to-vtt" },
      { label: "SRT to TXT Converter", href: "/srt-to-txt" },
      { label: "SRT to ASS Converter", href: "/srt-to-ass" },
      { label: "Open SRT File", href: "/open-srt-file" },
      { label: "Video to Text Converter", href: "/features/convert-to-text" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
                YT
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                YouTube <span className="text-primary">Transcripts</span>
              </span>
            </a>
            <p className="mt-3 text-xs leading-relaxed text-muted/70">
              Free <strong>YouTube transcript generator</strong> — convert any
              YouTube video to text instantly. Download transcripts with
              timestamps, generate AI summaries, and export in multiple formats.
              3 free transcripts per day; sign in for 100/day.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-primary hover:bg-primary/5"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-primary hover:bg-primary/5"
                aria-label="Twitter"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted/60">
            &copy; {year} YouTube Transcripts |{" "}
            <strong>Free YouTube Transcript Generator</strong> | All rights
            reserved.
          </p>
          <p className="mt-1 text-xs text-muted/40">
            Not affiliated with YouTube. This tool is for educational and
            personal use only. YouTube is a trademark of Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}
