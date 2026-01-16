// Loading skeleton for product page
// Shown during navigation and initial page load

export default function ProductLoading() {
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Title Skeleton */}
              <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-4"></div>

              {/* Description Skeleton */}
              <div className="animate-pulse h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="animate-pulse h-4 w-3/4 bg-gray-200 rounded mb-6"></div>

              {/* Account Information Card Skeleton */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="animate-pulse h-5 w-40 bg-gray-300 rounded mb-3"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="animate-pulse h-4 w-16 bg-gray-200 rounded mb-2"></div>
                    <div className="animate-pulse h-5 w-32 bg-gray-300 rounded"></div>
                  </div>
                  <div>
                    <div className="animate-pulse h-4 w-16 bg-gray-200 rounded mb-2"></div>
                    <div className="animate-pulse h-5 w-32 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Feature Cards Skeleton */}
              <div className="space-y-6">
                {/* Email System Card */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="animate-pulse h-5 w-40 bg-green-200 rounded mb-2"></div>
                  <div className="animate-pulse h-4 w-full bg-green-100 rounded mb-1"></div>
                  <div className="animate-pulse h-4 w-2/3 bg-green-100 rounded mb-3"></div>
                  <div className="animate-pulse h-10 w-40 bg-green-200 rounded"></div>
                </div>

                {/* Product Build Card */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="animate-pulse h-5 w-40 bg-blue-200 rounded mb-2"></div>
                  <div className="animate-pulse h-4 w-full bg-blue-100 rounded mb-1"></div>
                  <div className="animate-pulse h-4 w-3/4 bg-blue-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
