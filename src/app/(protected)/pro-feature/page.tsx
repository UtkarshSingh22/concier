// 🏗️ USER EDITABLE - DEMO PRO FEATURE PAGE
// This page demonstrates how to protect features behind entitlements.
// Customize the feature content and entitlement requirements as needed.

import Header from "@/components/Header";
import { FeatureGate } from "@/components/FeatureGate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Zap } from "lucide-react";

export const metadata = {
  title: "Pro Feature Demo",
  description: "Demonstration of a premium feature behind paywall.",
};

export default async function ProFeaturePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Premium Features
            </h1>
            <p className="mt-2 text-gray-600">
              Access advanced tools and capabilities with your Pro plan.
            </p>
          </div>

          {/* Grid layout for side-by-side cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Another Pro Feature - Advanced Tools */}
            <FeatureGate entitlement="pro_features">
              <Card className="border-indigo-200 bg-indigo-50/50 h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                      <Zap className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Advanced Analytics (Pro Feature)
                      </CardTitle>
                      <CardDescription>
                        Access advanced analytics and reporting features
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">
                        Unlock detailed insights with custom dashboards and
                        real-time data visualization.
                      </p>
                      <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                        View Analytics Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FeatureGate>

            {/* Free feature - always available */}
            <Card className="border-green-200 bg-green-50/50 h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Basic Security Settings (Free Feature)
                    </CardTitle>
                    <CardDescription>
                      Essential security features available to all users
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Button
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Manage Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
