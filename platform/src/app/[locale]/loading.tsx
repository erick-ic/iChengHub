export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full bg-[#f5f5f7] flex flex-col">
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .skeleton-pulse { animation: skeleton-pulse 1.4s ease-in-out infinite; }
      `}</style>

      <div className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-[#e52129] rounded-full skeleton-pulse" />
          <div className="h-4 w-28 bg-gray-200 rounded skeleton-pulse" />
        </div>

        <div className="h-9 w-3/4 sm:w-2/3 bg-gray-200 rounded-lg skeleton-pulse" />
        <div className="h-5 w-1/2 sm:w-1/3 bg-gray-200 rounded skeleton-pulse" />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-5 w-full bg-gray-200 rounded skeleton-pulse" />
            <div className="h-5 w-11/12 bg-gray-200 rounded skeleton-pulse" />
            <div className="h-5 w-4/5 bg-gray-200 rounded skeleton-pulse" />
            <div className="mt-2 h-72 w-full bg-gray-200 rounded-xl skeleton-pulse" />
            <div className="h-5 w-11/12 bg-gray-200 rounded skeleton-pulse" />
            <div className="h-5 w-3/4 bg-gray-200 rounded skeleton-pulse" />
          </div>

          <aside className="hidden md:block space-y-4">
            <div className="h-5 w-24 bg-gray-200 rounded skeleton-pulse" />
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-gray-200 skeleton-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 bg-gray-200 rounded skeleton-pulse" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded skeleton-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-[#e52129]" />
            <span className="skeleton-pulse">Loading…</span>
          </div>
        </div>
      </div>
    </div>
  );
}
