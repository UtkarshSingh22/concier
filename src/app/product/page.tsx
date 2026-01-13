// 🏗️ USER EDITABLE - BUILD YOUR PRODUCT HERE
// This is YOUR code. Everything in /product is for you to customize.
// The boilerplate handles auth, billing, and payments - you build the product.

import { requireAuth } from "@/lib/auth-utils";
import Header from "@/components/Header";

export default async function ProductPage() {
  const user = await requireAuth(); // Protected route - redirects to /auth if not logged in

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Dashboard
              </h1>
              <p className="text-gray-600 mb-6">
                Welcome to your SaaS! This is your protected product area. Start
                building your features here.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Account Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">
                      {user.name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  🚀 Build Your Product
                </h3>
                <p className="text-sm text-blue-700">
                  This is where you implement your SaaS features. Add your
                  dashboard, API routes, and UI components in the /product
                  directory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
