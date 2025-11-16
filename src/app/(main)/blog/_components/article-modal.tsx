'use client';

import { X, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogPage } from '@/types/page';
import { MDXContent } from './mdx-content';
import { Suspense } from 'react';

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
          <Suspense fallback={<div className="text-center py-8">Cargando...</div>}>
            <MDXContent content={page.content} variant="modal" />
          </Suspense>
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
