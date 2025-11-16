'use client';

import { X, Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogPage } from '@/types/page';
import { MDXContent } from './mdx-content';
import { Suspense } from 'react';

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
          <Suspense fallback={<div className="text-center py-4 text-sm">Cargando...</div>}>
            <MDXContent content={page.content} variant="drawer" />
          </Suspense>
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
