export function SolarFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-primary">⚡</span>
            <span>Resolve Energia Solar © 2024</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Construindo o futuro sustentável</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}