import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
            <FileQuestion size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Page not found</h1>
          <p className="mt-3 text-muted leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or doesn&apos;t exist.
          </p>
          <a
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Home size={16} />
            Back to Home
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
