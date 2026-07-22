import Header from "./Header";
import Footer from "./Footer";

interface PageSection {
  id: string;
  label: string;
}

interface StaticPageProps {
  children: React.ReactNode;
  breadcrumb?: { label: string; href?: string };
  sections?: PageSection[];
}

export default function StaticPage({
  children,
  breadcrumb,
  sections,
}: StaticPageProps) {
  const showToc = sections && sections.length > 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          {/* Breadcrumb */}
          {breadcrumb && (
            <nav className="mb-8 text-sm text-muted">
              <a href="/" className="transition-colors hover:text-foreground">
                Home
              </a>
              <span className="mx-2">/</span>
              {breadcrumb.href ? (
                <a
                  href={breadcrumb.href}
                  className="transition-colors hover:text-foreground"
                >
                  {breadcrumb.label}
                </a>
              ) : (
                <span className="text-foreground">{breadcrumb.label}</span>
              )}
            </nav>
          )}

          {/* Two-column layout with optional TOC */}
          <div className={showToc ? "grid grid-cols-[1fr_180px] gap-12" : ""}>
            <article>{children}</article>

            {showToc && (
              <aside className="hidden lg:block">
                <div className="sticky top-20">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    On this page
                  </h4>
                  <nav className="flex flex-col">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="border-l-2 border-border py-1.5 pl-3 text-sm text-muted transition-colors hover:border-primary hover:text-primary"
                      >
                        {section.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
