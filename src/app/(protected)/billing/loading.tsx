// Loading skeleton for billing page
// Shown during navigation and initial page load

export default function BillingLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Title Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="animate-pulse h-9 w-64 bg-gray-200 rounded mb-3"></div>
                <div className="animate-pulse h-5 w-96 bg-gray-200 rounded"></div>
              </div>
              <div className="animate-pulse h-9 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Plan Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse h-6 w-6 bg-gray-200 rounded"></div>
                    <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="animate-pulse h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
                <div className="animate-pulse h-4 w-full bg-gray-200 rounded"></div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
                      <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="animate-pulse h-4 w-28 bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="animate-pulse h-5 w-32 bg-gray-200 rounded mb-3"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center">
                          <div className="animate-pulse h-4 w-4 bg-gray-200 rounded mr-2"></div>
                          <div className="animate-pulse h-4 w-40 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Options Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="animate-pulse h-6 w-40 bg-gray-200 rounded mb-2"></div>
                <div className="animate-pulse h-4 w-full bg-gray-200 rounded"></div>
              </div>
              <div className="p-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="animate-pulse h-5 w-24 bg-gray-200 rounded"></div>
                    <div className="animate-pulse h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="animate-pulse h-4 w-full bg-gray-200 rounded mb-1"></div>
                  <div className="animate-pulse h-4 w-2/3 bg-gray-200 rounded mb-3"></div>
                  <div className="animate-pulse h-10 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
