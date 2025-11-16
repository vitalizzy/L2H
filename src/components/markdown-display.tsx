"use client";

import { useMemo } from "react";
import { MarkdownToHtml } from "@/utils/markdown-to-html";

interface MarkdownDisplayProps {
  content: string;
  className?: string;
  targetBlank?: boolean;
  sanitize?: boolean;
}

/**
 * Componente React para mostrar Markdown convertido a HTML
 * Soporta:
 * - Títulos, negrita, cursiva, tachado
 * - Enlaces (http, mailto, tel)
 * - Imágenes
 * - Tablas
 * - Código
 * - Listas
 */
export const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({
  content,
  className = "prose dark:prose-invert max-w-none",
  targetBlank = true,
  sanitize = true,
}) => {
  const html = useMemo(() => {
    const converter = new MarkdownToHtml({
      targetBlank,
      sanitize,
    });
    return converter.getSafeHtml(content);
  }, [content, targetBlank, sanitize]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      role="article"
    />
  );
};

export default MarkdownDisplay;
