'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">¡Oops!</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Algo salió mal</h2>
        <p className="text-muted-foreground mb-8">
          Ocurrió un error inesperado. Por favor, intenta de nuevo.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
