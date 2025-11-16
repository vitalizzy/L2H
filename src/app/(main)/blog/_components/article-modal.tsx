'use client';

import { MDXRemote } from 'next-mdx-remote/rsc';
import { X, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPage } from '@/types/page';

const mdxComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-3xl font-bold mt-6 mb-3">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-2xl font-bold mt-4 mb-2">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-xl font-bold mt-3 mb-2">{children}</h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-lg font-bold mt-2 mb-1">{children}</h4>
  ),
  p: ({ children }: any) => (
    <p className="text-base leading-7 my-4">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside space-y-2 my-4 ml-4">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside space-y-2 my-4 ml-4">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="text-base leading-7">{children}</li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: any) => {
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
  td: ({ children }: any) => (
    <td className="border border-border p-2">{children}</td>
  ),
};

interface ArticleModalProps {
  page: BlogPage | null;
  onClose: () => void;
}

export function ArticleModal({ page, onClose }: ArticleModalProps) {
  if (!page) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-background rounded-lg shadow-2xl z-50 overflow-y-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4 md:p-6 flex items-center justify-between shrink-0">
          <div className="flex-1 pr-4">
            <h2 className="text-xl md:text-2xl font-bold line-clamp-2">{page.title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Meta Information */}
        <div className="border-b px-4 md:px-6 py-4 shrink-0">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {page.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{page.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={page.created_at}>
                {new Date(page.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <article className="prose dark:prose-invert max-w-none">
            <MDXRemote source={page.content} components={mdxComponents} />
          </article>
        </div>

        {/* Footer */}
        <div className="border-t p-4 md:p-6 flex justify-end shrink-0 gap-3">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </>
  );
}
