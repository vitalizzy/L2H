import { MDXRemote } from 'next-mdx-remote/rsc';

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

interface MDXContentProps {
  content: string;
  variant?: 'modal' | 'drawer';
}

export async function MDXContent({ content, variant = 'modal' }: MDXContentProps) {
  const isMobile = variant === 'drawer';

  if (isMobile) {
    // Componentes compactos para drawer
    const smallComponents = {
      ...mdxComponents,
      h1: ({ children }: any) => (
        <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>
      ),
      p: ({ children }: any) => (
        <p className="text-sm leading-6 my-3">{children}</p>
      ),
      ul: ({ children }: any) => (
        <ul className="list-disc list-inside space-y-1 my-3 ml-2 text-sm">{children}</ul>
      ),
      code: ({ children, className }: any) => (
        <pre className="bg-muted p-3 rounded text-xs overflow-x-auto my-3">
          <code className={className}>{children}</code>
        </pre>
      ),
    };

    return (
      <article className="prose prose-sm dark:prose-invert max-w-none">
        <MDXRemote source={content} components={smallComponents} />
      </article>
    );
  }

  return (
    <article className="prose dark:prose-invert max-w-none">
      <MDXRemote source={content} components={mdxComponents} />
    </article>
  );
}
