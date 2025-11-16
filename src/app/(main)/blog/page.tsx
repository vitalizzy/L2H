'use client';

import { useState, useEffect } from 'react';
import { getAllPages } from '@/utils/supabase/client';
import Link from 'next/link';
import { ArrowRight, Calendar, User, Eye, Maximize2 } from 'lucide-react';
import { ArticleModal } from './_components/article-modal';
import { ArticleDrawer } from './_components/article-drawer';
import type { BlogPage } from '@/types/page';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  const [pages, setPages] = useState<BlogPage[]>([]);
  const [selectedPageModal, setSelectedPageModal] = useState<BlogPage | null>(null);
  const [selectedPageDrawer, setSelectedPageDrawer] = useState<BlogPage | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'modal' | 'drawer'>('modal');

  useEffect(() => {
    async function loadPages() {
      const data = await getAllPages();
      setPages(data);
      setLoading(false);
    }
    loadPages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando artículos...</p>
      </div>
    );
  }

  const handleOpenModal = (page: BlogPage) => {
    setSelectedPageModal(page);
  };

  const handleOpenDrawer = (page: BlogPage) => {
    setSelectedPageDrawer(page);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Artículos, tutoriales y recursos sobre desarrollo de Mini SaaS
          </p>

          {/* View Mode Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">Modo de visualización:</span>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'modal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('modal')}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Modal
              </Button>
              <Button
                variant={viewMode === 'drawer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('drawer')}
                className="gap-2"
              >
                <Maximize2 className="h-4 w-4" />
                Drawer
              </Button>
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              {viewMode === 'modal' ? '📍 Centro' : '📍 Lateral'}
            </span>
          </div>
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
                      <Link href={`/blog/${page.slug}`} className="group/link">
                        <h2 className="text-2xl font-bold mb-2 group-hover/link:text-primary transition-colors">
                          {page.title}
                        </h2>
                      </Link>
                      <p className="text-muted-foreground mb-4">{page.description}</p>
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
                        {new Date(page.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {viewMode === 'modal' ? (
                      <>
                        <button
                          onClick={() => handleOpenModal(page)}
                          className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all group/btn"
                        >
                          <span>Leer más</span>
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <Link
                          href={`/blog/${page.slug}`}
                          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                        >
                          Ver página completa
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenDrawer(page)}
                          className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all group/btn"
                        >
                          <span>Leer más</span>
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <Link
                          href={`/blog/${page.slug}`}
                          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                        >
                          Ver página completa
                        </Link>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Components */}
      <ArticleModal page={selectedPageModal} onClose={() => setSelectedPageModal(null)} />
      <ArticleDrawer
        page={selectedPageDrawer}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedPageDrawer(null);
        }}
      />
    </div>
  );
}
