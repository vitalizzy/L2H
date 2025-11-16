'use client';

import { MDXRemote } from 'next-mdx-remote/rsc';
import { X, Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPage } from '@/types/page';

const mdxComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-2xl font-bold mt-6 mb-3">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-xl font-bold mt-4 mb-2">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-lg font-bold mt-3 mb-2">{children}</h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-base font-bold mt-2 mb-1">{children}</h4>
  ),
  p: ({ children }: any) => (
    <p className="text-sm leading-6 my-3">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside space-y-1 my-3 ml-2 text-sm">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside space-y-1 my-3 ml-2 text-sm">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="text-sm leading-6">{children}</li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary pl-3 italic my-3 text-muted-foreground text-sm">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: any) => {
    return (
      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto my-3">
        <code className={className}>{children}</code>
      </pre>
    );
  },
  inlineCode: ({ children }: any) => (
    <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">{children}</code>
  ),
  a: ({ href, children }: any) => (
    <a href={href} className="text-primary hover:underline text-sm">
      {children}
    </a>
  ),
  img: ({ src, alt }: any) => (
    <img src={src} alt={alt} className="rounded-lg max-w-full h-auto my-3" />
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full border-collapse border border-border text-xs">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-border bg-muted p-1.5 text-left font-bold">{children}</th>
  ),
  td: ({ children }: any) => (
    <td className="border border-border p-1.5">{children}</td>
  ),
};

interface ArticleDrawerProps {
  page: BlogPage | null;
  onClose: () => void;
  isOpen: boolean;
}

export function ArticleDrawer({ page, onClose, isOpen }: ArticleDrawerProps) {
  if (!page) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-screen w-full sm:w-[80%] md:w-[60%] lg:w-[50%] bg-background shadow-lg z-50 transition-transform duration-300 overflow-y-auto flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between shrink-0">
          <div className="flex-1">
            <h2 className="text-lg font-bold line-clamp-2">{page.title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0 ml-2"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Meta Information */}
        <div className="border-b px-4 py-3 shrink-0">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            {page.author && (
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span>{page.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={page.created_at}>
                {new Date(page.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <article className="prose prose-sm dark:prose-invert max-w-none">
            <MDXRemote source={page.content} components={mdxComponents} />
          </article>
        </div>

        {/* Footer */}
        <div className="border-t p-3 flex justify-end shrink-0">
          <Button size="sm" variant="outline" onClick={onClose} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Cerrar
          </Button>
        </div>
      </div>
    </>
  );
}
