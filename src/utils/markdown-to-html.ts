/**
 * MarkdownToHtml - Convierte Markdown a HTML con soporte completo
 * Características:
 * - Títulos (h1-h6)
 * - Texto en negrita, cursiva, tachado
 * - Listas ordenadas y sin orden
 * - Enlaces (http, mailto, tel)
 * - Imágenes
 * - Bloques de código
 * - Tablas
 * - Citas
 * - Líneas horizontales
 * - Énfasis y combinaciones
 */

interface MarkdownOptions {
  sanitize?: boolean;
  targetBlank?: boolean; // Abre enlaces en nueva pestaña
}

export class MarkdownToHtml {
  private options: MarkdownOptions;

  constructor(options: MarkdownOptions = {}) {
    this.options = {
      sanitize: true,
      targetBlank: true,
      ...options,
    };
  }

  /**
   * Convierte Markdown a HTML
   */
  public convert(markdown: string): string {
    if (!markdown) return "";

    let html = markdown;

    // Procesar en orden específico para evitar conflictos
    html = this.processCodeBlocks(html);
    html = this.processTables(html);
    html = this.processHeadings(html);
    html = this.processHorizontalRules(html);
    html = this.processLists(html);
    html = this.processBlockquotes(html);
    html = this.processLineBreaks(html);
    html = this.processImages(html);
    html = this.processLinks(html);
    html = this.processInlineFormatting(html);
    html = this.processParagraphs(html);

    return html.trim();
  }

  /**
   * Procesa bloques de código (```...```)
   */
  private processCodeBlocks(text: string): string {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    return text.replace(codeBlockRegex, (match, language, code) => {
      const lang = language ? ` class="language-${this.escape(language)}"` : "";
      const escapedCode = this.escape(code.trim());
      return `<pre><code${lang}>${escapedCode}</code></pre>`;
    });
  }

  /**
   * Procesa tablas Markdown
   */
  private processTables(text: string): string {
    const tableRegex =
      /\|(.+)\n\|[-\s|:]+\n((?:\|.+\n?)*)/gm;
    return text.replace(tableRegex, (match, header: string, rows: string) => {
      const headers = header
        .split("|")
        .map((h: string) => h.trim())
        .filter((h: string) => h);
      const rowArray = rows
        .trim()
        .split("\n")
        .map((row: string) =>
          row
            .split("|")
            .map((cell: string) => cell.trim())
            .filter((cell: string) => cell)
        );

      let table = "<table><thead><tr>";
      headers.forEach((h: string) => {
        table += `<th>${this.escape(h)}</th>`;
      });
      table += "</tr></thead><tbody>";

      rowArray.forEach((row: string[]) => {
        table += "<tr>";
        row.forEach((cell: string) => {
          table += `<td>${this.escape(cell)}</td>`;
        });
        table += "</tr>";
      });

      table += "</tbody></table>";
      return table;
    });
  }

  /**
   * Procesa títulos (#, ##, ###, etc.)
   */
  private processHeadings(text: string): string {
    for (let i = 6; i >= 1; i--) {
      const regex = new RegExp(`^${`#`.repeat(i)}\\s+(.+)$`, "gm");
      text = text.replace(regex, `<h${i}>$1</h${i}>`);
    }
    return text;
  }

  /**
   * Procesa líneas horizontales (---, ***, ___)
   */
  private processHorizontalRules(text: string): string {
    return text.replace(/^[\*\-_]{3,}$/gm, "<hr>");
  }

  /**
   * Procesa listas (ordenadas y sin orden)
   */
  private processLists(text: string): string {
    // Listas sin orden (-, *, +)
    const unorderedRegex = /^[\-\*\+]\s+(.+)$/gm;
    const unorderedMatches = [...text.matchAll(unorderedRegex)];

    if (unorderedMatches.length > 0) {
      let listHtml = "<ul>";
      let previousMatches = 0;

      for (let i = 0; i < unorderedMatches.length; i++) {
        const match = unorderedMatches[i];
        const item = match[1];
        const index = match.index!;

        // Si hay texto entre este item y el anterior, cerrar lista
        if (i > 0) {
          const prevMatch = unorderedMatches[i - 1];
          const prevIndex = prevMatch.index!;
          const prevEnd = prevIndex + prevMatch[0].length;
          const gap = text.substring(prevEnd, index).trim();

          if (gap && gap !== "") {
            listHtml += "</ul>";
            previousMatches = i;
          }
        }

        if (i === previousMatches) {
          listHtml = "<ul>";
        }

        listHtml += `<li>${item}</li>`;
      }
      listHtml += "</ul>";
      text = text.replace(unorderedRegex, (match) => {
        return ""; // Será reemplazado por el listHtml
      });
      text = text.replace(/\n+/g, "\n");
      text = text.replace(/^[\-\*\+]\s+.+$/gm, (match) => {
        return match; // Mantener para procesamiento
      });
    }

    // Listas ordenadas (1., 2., etc.)
    const orderedRegex = /^\d+\.\s+(.+)$/gm;
    const orderedMatches = [...text.matchAll(orderedRegex)];

    if (orderedMatches.length > 0) {
      let listHtml = "<ol>";
      orderedMatches.forEach((match) => {
        listHtml += `<li>${match[1]}</li>`;
      });
      listHtml += "</ol>";
      text = text.replace(orderedRegex, (match, item) => {
        return `<li>${item}</li>`;
      });
    }

    // Envolver en ol/ul si es necesario
    text = text.replace(
      /(<li>.*?<\/li>)/m,
      (match) => {
        if (!match.includes("<ul>") && !match.includes("<ol>")) {
          return match; // Ya está envuelto
        }
        return match;
      }
    );

    return text;
  }

  /**
   * Procesa citas (> texto)
   */
  private processBlockquotes(text: string): string {
    const quoteRegex = /^>\s+(.+)$/gm;
    let inBlockquote = false;
    let blockquoteContent = "";

    const lines = text.split("\n");
    let result = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isQuote = quoteRegex.test(line);

      if (isQuote) {
        if (!inBlockquote) {
          inBlockquote = true;
          blockquoteContent = line.replace(/^>\s+/, "");
        } else {
          blockquoteContent += "\n" + line.replace(/^>\s+/, "");
        }
      } else {
        if (inBlockquote) {
          result.push(`<blockquote>${blockquoteContent}</blockquote>`);
          inBlockquote = false;
          blockquoteContent = "";
        }
        if (line.trim()) {
          result.push(line);
        }
      }
    }

    if (inBlockquote) {
      result.push(`<blockquote>${blockquoteContent}</blockquote>`);
    }

    return result.join("\n");
  }

  /**
   * Procesa saltos de línea
   */
  private processLineBreaks(text: string): string {
    // Reemplazar dos o más saltos por un párrafo
    return text.replace(/\n\n+/g, "\n\n");
  }

  /**
   * Procesa imágenes ![alt](url "titulo")
   */
  private processImages(text: string): string {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]+)")?\)/g;
    return text.replace(imageRegex, (match, alt, src, title) => {
      const titleAttr = title ? ` title="${this.escape(title)}"` : "";
      return `<img src="${this.escape(src)}" alt="${this.escape(alt)}"${titleAttr} />`;
    });
  }

  /**
   * Procesa enlaces de todos los tipos:
   * - HTTP/HTTPS: [texto](https://...)
   * - Mailto: [texto](mailto:email@example.com)
   * - Teléfono: [texto](tel:+34...)
   */
  private processLinks(text: string): string {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return text.replace(linkRegex, (match, linkText, url) => {
      const target =
        this.options.targetBlank && url.startsWith("http")
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";

      // Detectar tipo de enlace
      if (url.startsWith("mailto:")) {
        return `<a href="${this.escape(url)}">${this.escape(linkText)}</a>`;
      } else if (url.startsWith("tel:")) {
        return `<a href="${this.escape(url)}">${this.escape(linkText)}</a>`;
      } else if (url.startsWith("http")) {
        return `<a href="${this.escape(url)}"${target}>${this.escape(linkText)}</a>`;
      } else {
        // Enlace relativo
        return `<a href="${this.escape(url)}">${this.escape(linkText)}</a>`;
      }
    });
  }

  /**
   * Procesa formato inline: negrita, cursiva, tachado
   */
  private processInlineFormatting(text: string): string {
    // Negrita y cursiva combinadas ***texto***
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");

    // Negrita **texto**
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");

    // Cursiva *texto* o _texto_
    text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
    text = text.replace(/_(.+?)_/g, "<em>$1</em>");

    // Tachado ~~texto~~
    text = text.replace(/~~(.+?)~~/g, "<s>$1</s>");

    // Código inline `texto`
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

    return text;
  }

  /**
   * Procesa párrafos (agrupa texto en <p>)
   */
  private processParagraphs(text: string): string {
    const lines = text.split("\n");
    let result = [];
    let paragraph = "";

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed === "") {
        if (paragraph) {
          result.push(`<p>${paragraph}</p>`);
          paragraph = "";
        }
      } else if (
        trimmed.startsWith("<") ||
        trimmed.startsWith("|") ||
        trimmed.startsWith("-") ||
        trimmed.startsWith(">")
      ) {
        if (paragraph) {
          result.push(`<p>${paragraph}</p>`);
          paragraph = "";
        }
        result.push(line);
      } else {
        paragraph += (paragraph ? " " : "") + trimmed;
      }
    }

    if (paragraph) {
      result.push(`<p>${paragraph}</p>`);
    }

    return result.join("\n");
  }

  /**
   * Escapa caracteres HTML
   */
  private escape(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }

  /**
   * Obtiene HTML seguro (opcionalmente sanitizado)
   */
  public getSafeHtml(markdown: string): string {
    const html = this.convert(markdown);
    if (this.options.sanitize) {
      return this.sanitizeHtml(html);
    }
    return html;
  }

  /**
   * Sanitiza HTML básico (elimina scripts)
   */
  private sanitizeHtml(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/on\w+\s*=\s*[^\s>]*/gi, "");
  }
}

// Exportar función utilitaria simplificada
export function markdownToHtml(markdown: string, options?: MarkdownOptions): string {
  const converter = new MarkdownToHtml(options);
  return converter.convert(markdown);
}
