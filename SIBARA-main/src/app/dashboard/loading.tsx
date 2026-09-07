export default function DashboardLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071229]">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 12% -10%, #123a72 0%, #0a2348 38%, #06152f 72%, #050f24 100%)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 pattern-dots opacity-[0.05]" />

      <div className="relative z-10 flex flex-col min-h-screen lg:ml-[264px]">
        {/* Topbar skeleton, dark */}
        <div className="sticky top-0 z-20 h-16 shrink-0 flex items-center gap-3 bg-[#081937]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6">
          <div className="h-3.5 w-40 rounded-full bg-white/10 animate-pulse" />
          <div className="ml-auto flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>

        {/* Content skeleton, dark */}
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1400px] w-full mx-auto">
          <div className="h-32 sm:h-40 rounded-[20px] bg-white/[0.04] border border-white/[0.08] animate-pulse mb-6" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="surface-card-dark px-5 py-5 animate-pulse">
                <div className="h-2.5 w-20 rounded-full bg-white/10 mb-4" />
                <div className="h-8 w-14 rounded-lg bg-white/10" />
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 surface-card-dark animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
