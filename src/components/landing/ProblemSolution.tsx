// 🏗️ USER EDITABLE - LANDING PAGE COMPONENT
// Customize the problem/solution messaging and design.
// This component is fully editable and part of your landing page.

import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProblemSolution() {
  return (
    <section className="bg-muted/30 pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* The Problem */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground">
                  The Problem
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground leading-relaxed">
                    Managing complex workflows across teams often leads to
                    inefficiencies, missed deadlines, and communication
                    breakdowns.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground leading-relaxed">
                    Traditional tools are either too complex for simple tasks or
                    too limited for growing team needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* The Solution */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground">
                  The Solution
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground leading-relaxed">
                    A straightforward platform that connects team processes,
                    automates repetitive tasks, and provides clear visibility.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground leading-relaxed">
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
