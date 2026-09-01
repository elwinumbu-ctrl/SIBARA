export default function Loading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 pattern-dots-soft opacity-[0.5]" />
      <div className="pointer-events-none fixed -top-40 right-[-10%] z-0 w-[520px] h-[520px] rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-15%] left-[-8%] z-0 w-[440px] h-[440px] rounded-full bg-cyan/8 blur-3xl" />

      <div className="relative z-10 flex flex-col min-h-screen lg:ml-[264px]">
        {/* Topbar skeleton */}
        <div className="sticky top-0 z-20 h-16 shrink-0 flex items-center gap-3 bg-white/80 backdrop-blur-xl border-b border-white/60 px-4 sm:px-6">
          <div className="h-3.5 w-40 rounded-full bg-surface-subtle animate-pulse" />
          <div className="ml-auto flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-surface-subtle animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-surface-subtle animate-pulse" />
          </div>
        </div>

        {/* Content skeleton */}
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1400px] w-full mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl shadow-panel px-5 py-5 animate-pulse"
              >
                <div className="h-2.5 w-20 rounded-full bg-surface-subtle mb-4" />
                <div className="h-8 w-14 rounded-lg bg-surface-subtle" />
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-20 bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl shadow-panel animate-pulse"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
