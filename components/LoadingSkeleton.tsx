export default function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-gray-800/50 rounded-xl w-1/3 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-800/50 rounded w-1/4 animate-pulse"></div>
        </div>

        {/* Stats Bar Skeleton */}
        <div className="mb-8 p-4 bg-gray-800/30 rounded-xl">
          <div className="flex gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-6 bg-gray-700 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-10 bg-gray-800/50 rounded-xl w-1/4 animate-pulse mb-6"></div>
            
            {/* Groups Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                  {/* Group Header */}
                  <div className="flex justify-between mb-6">
                    <div className="h-8 bg-gray-700 rounded w-24 animate-pulse"></div>
                    <div className="h-6 bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>
                  
                  {/* Teams Table Skeleton */}
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                          <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
                        </div>
                        <div className="h-6 bg-gray-700 rounded w-12 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            {/* Info Card Skeleton */}
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
              <div className="h-8 bg-gray-700 rounded w-1/2 mb-6 animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-700/50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Updates Card Skeleton */}
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-6 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-10 bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}