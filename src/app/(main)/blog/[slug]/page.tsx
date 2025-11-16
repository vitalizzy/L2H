import { getPageBySlug, getPageSlugs } from "@/utils/supabase/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Página no encontrada",
    };
  }

  return {
    title: `${page.title} - L2H Blog`,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
      publishedTime: page.created_at,
      authors: page.author ? [page.author] : [],
    },
  };
}

// Componentes para renderizar markdown
const mdxComponents = {
  h1: ({ children }: any) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-2xl font-bold mt-4 mb-2">{children}</h3>,
  h4: ({ children }: any) => <h4 className="text-xl font-bold mt-3 mb-2">{children}</h4>,
  p: ({ children }: any) => <p className="text-base leading-7 my-4">{children}</p>,
  ul: ({ children }: any) => <ul className="list-disc list-inside space-y-2 my-4 ml-4">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 my-4 ml-4">{children}</ol>,
  li: ({ children }: any) => <li className="text-base leading-7">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: any) => {
    const language = className?.replace("language-", "");
    return (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4 text-sm">
        <code className={className}>{children}</code>
      </pre>
    );
  },
  inlineCode: ({ children }: any) => (
    <code className="bg-muted px-2 py-1 rounded font-mono text-sm">{children}</code>
  ),
  a: ({ href, children }: any) => (
    <a href={href} className="text-primary hover:underline">
      {children}
    </a>
  ),
  img: ({ src, alt }: any) => (
    <img src={src} alt={alt} className="rounded-lg max-w-full h-auto my-4" />
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse border border-border">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-border bg-muted p-2 text-left font-bold">{children}</th>
  ),
  td: ({ children }: any) => <td className="border border-border p-2">{children}</td>,
};

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/blog">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <section className="py-12 px-4 border-b">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{page.description}</p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {page.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{page.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
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
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto prose dark:prose-invert max-w-none">
          <MDXRemote source={page.content} components={mdxComponents} />
        </div>
      </section>

      {/* Back to Blog */}
      <section className="py-12 px-4 border-t">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al blog
            </Button>
          </Link>
        </div>
      </section>
    </article>
  );
}
