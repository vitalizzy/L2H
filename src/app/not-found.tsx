export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
