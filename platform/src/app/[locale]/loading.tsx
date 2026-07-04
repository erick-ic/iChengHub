export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col">
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .skeleton-pulse { animation: skeleton-pulse 1.4s ease-in-out infinite; }
      `}</style>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center space-y-4">
          <div className="h-10 w-2/3 sm:w-1/2 mx-auto bg-gray-200 rounded skeleton-pulse" />
          <div className="h-5 w-3/4 sm:w-2/3 mx-auto bg-gray-200 rounded skeleton-pulse" />
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-5 w-full bg-gray-200 rounded skeleton-pulse" />
          <div className="h-5 w-11/12 bg-gray-200 rounded skeleton-pulse" />
          <div className="h-5 w-5/6 bg-gray-200 rounded skeleton-pulse" />
          <div className="h-5 w-3/4 bg-gray-200 rounded skeleton-pulse" />
        </div>
      </section>
    </div>
  );
}
