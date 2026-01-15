// 🏗️ USER EDITABLE - LANDING PAGE COMPONENT
// Customize the problem/solution messaging and design.
// This component is fully editable and part of your landing page.

import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProblemSolution() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* The Problem */}
          <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 border border-red-200">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  The Problem
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 leading-relaxed">
                    Managing complex workflows across teams often leads to
                    inefficiencies, missed deadlines, and communication
                    breakdowns.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 leading-relaxed">
                    Traditional tools are either too complex for simple tasks or
                    too limited for growing team needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* The Solution */}
          <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 border border-emerald-200">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  The Solution
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 leading-relaxed">
                    A straightforward platform that connects team processes,
                    automates repetitive tasks, and provides clear visibility.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 leading-relaxed">
                    Smart workflows and real-time analytics help teams stay
                    aligned and productive without unnecessary complexity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
