export const LoadingComponent = () => {
    
    return (
      <div className="flex min-h-screen w-full bg-background animate-pulse">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-card/80 border-r border-border p-6 gap-6">
          <div className="w-14 h-14 rounded-full bg-muted self-center mb-4" />
          <div className="h-4 w-3/4 rounded bg-muted mb-2" />
          <div className="h-3 w-2/3 rounded bg-muted/70 mb-6" />
          <div className="flex flex-col gap-3">
            <div className="h-3 w-5/6 rounded bg-muted/60" />
            <div className="h-3 w-2/3 rounded bg-muted/50" />
            <div className="h-3 w-3/4 rounded bg-muted/40" />
            <div className="h-3 w-1/2 rounded bg-muted/30" />
          </div>
        </aside>
        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="flex items-center h-20 px-8 border-b border-border bg-card/70 gap-6">
            <div className="h-10 w-1/3 rounded bg-muted/60" />
            <div className="ml-auto flex items-center gap-4">
              <div className="h-8 w-32 rounded bg-muted/40" />
              <div className="h-10 w-10 rounded-full bg-muted/70" />
            </div>
          </header>
          {/* Content */}
          <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Card skeletons */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl bg-card/80 border border-border shadow-md p-6 flex flex-col gap-4">
                <div className="h-6 w-1/2 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted/70" />
                <div className="h-3 w-full rounded bg-muted/60" />
                <div className="h-3 w-5/6 rounded bg-muted/50" />
                <div className="h-3 w-3/4 rounded bg-muted/40" />
              </div>
            ))}
          </main>
        </div>
      </div>
    );
}