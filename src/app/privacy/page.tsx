import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for YouTube Transcripts.",
};

export default function Page() {
  return (
    <StaticPage>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Privacy Policy
        </h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <h2 className="text-lg font-semibold text-foreground">
            Information We Collect
          </h2>
          <p>
            We collect minimal information necessary to provide our service.
            If you create an account, we store your email address and
            authentication details via Supabase. Transcripts you save to your
            account are stored securely. Anonymous usage is tracked via a
            cookie for rate limiting purposes only.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            How We Use Your Information
          </h2>
          <p>
            Your information is used solely to provide and improve the
            YouTube Transcripts service. We do not sell, rent, or share your
            personal information with third parties for their marketing
            purposes.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Cookies
          </h2>
          <p>
            We use a minimal cookie to track daily transcript usage for
            anonymous users. This cookie expires after one year and contains
            only a date and usage count. Authenticated users have usage
            tracked in our database for rate limiting.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Third-Party Services
          </h2>
          <p>
            We use Supabase for authentication and database services, and
            OpenAI for AI-powered summaries and chat features. Each service
            has its own privacy policy governing data handling.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Contact
          </h2>
          <p>
            For privacy-related inquiries, contact us at{" "}
            <a href="mailto:hello@youtubetranscripts.com" className="text-primary hover:underline">
              hello@youtubetranscripts.com
            </a>.
          </p>
        </div>
      </div>
    </StaticPage>
  );
}
