import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for YouTube Transcripts.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Terms of Service
        </h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <h2 className="text-lg font-semibold text-foreground">
            Service Description
          </h2>
          <p>
            YouTube Transcripts provides a free online tool for extracting
            and downloading transcripts from YouTube videos. The service
            relies on YouTube&apos;s caption data and requires videos to have
            captions enabled.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Acceptable Use
          </h2>
          <p>
            You agree to use this service for lawful purposes only. You may
            not use the service to violate any applicable laws or regulations.
            Automated or excessive use that impacts service stability is
            prohibited.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Rate Limits
          </h2>
          <p>
            Anonymous users are limited to 3 transcript generations per day.
            Signed-in users have higher limits. These limits may change at
            any time to ensure fair access for all users.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Disclaimer
          </h2>
          <p>
            This service is provided &quot;as is&quot; without warranties of
            any kind. Transcript accuracy depends on YouTube&apos;s caption
            data and may contain errors. We are not affiliated with YouTube
            or Google.
          </p>
        </div>
      </div>
    </StaticPage>
  );
}
