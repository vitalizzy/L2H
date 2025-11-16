import { getAllPages } from "@/utils/supabase/server";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { ArrowRight, Calendar, User } from "lucide-react";

export const metadata = {
  title: "Blog - L2H",
  description: "Artículos y recursos sobre Mini SaaS",
};

export default async function BlogPage() {
  const pages = await getAllPages();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
          <p className="text-lg text-muted-foreground">
            Artículos, tutoriales y recursos sobre desarrollo de Mini SaaS
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No hay artículos publicados aún.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {pages.map((page) => (
                <article
                  key={page.id}
                  className="group border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all duration-300"
                >
                  {/* Article Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <Link
                        href={`/blog/${page.slug}`}
                        className="group/link"
                      >
                        <h2 className="text-2xl font-bold mb-2 group-hover/link:text-primary transition-colors">
                          {page.title}
                        </h2>
                      </Link>
                      <p className="text-muted-foreground mb-4">
                        {page.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    {page.author && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{page.author}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={page.created_at}>
                        {new Date(page.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Link
                    href={`/blog/${page.slug}`}
                    className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all group/btn"
                  >
                    <span>Leer más</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
