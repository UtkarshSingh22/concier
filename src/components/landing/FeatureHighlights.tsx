// 🏗️ USER EDITABLE - LANDING PAGE COMPONENT
// Customize your key features, icons, and descriptions.
// This component is fully editable and part of your landing page.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow, Shield, BarChart3, Users, Zap } from "lucide-react";

const features = [
  {
    name: "Workflow Automation",
    description:
      "Automate repetitive tasks and reduce manual work across your organization with intelligent workflows.",
    icon: Workflow,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    name: "Enterprise Security",
    description:
      "Bank-level security with end-to-end encryption, SSO, and comprehensive compliance standards.",
    icon: Shield,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    name: "Real-time Analytics",
    description:
      "Track performance metrics and get actionable insights into your team's productivity and progress.",
    icon: BarChart3,
    gradient: "from-teal-500 to-cyan-500",
    bgGradient: "from-teal-50 to-cyan-50",
  },
  {
    name: "Team Collaboration",
    description:
      "Seamless collaboration tools that keep everyone aligned, informed, and working together efficiently.",
    icon: Users,
    gradient: "from-lime-500 to-green-500",
    bgGradient: "from-lime-50 to-green-50",
  },
];

export function FeatureHighlights() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50/30 py-24 sm:py-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-200/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 h-48 w-48 rounded-full bg-gradient-to-br from-teal-200/20 to-green-200/20 blur-2xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 text-sm font-medium text-indigo-700 mb-6">
            <Zap className="h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              succeed
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your workflow and boost
            team productivity.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card
                key={feature.name}
                className={`group relative overflow-hidden border-0 bg-gradient-to-br ${feature.bgGradient} shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1`}
              >
                {/* Animated background glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-3`}
                ></div>

                {/* Decorative corner accent */}
                <div
                  className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${feature.gradient} opacity-10 rounded-bl-3xl`}
                ></div>

                <CardHeader className="relative pb-6">
                  <div className="flex items-center gap-x-5">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {feature.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {feature.description}
                  </p>

                  {/* Subtle bottom accent */}
                  <div
                    className={`mt-6 h-1 w-16 bg-gradient-to-r ${feature.gradient} rounded-full opacity-60 group-hover:opacity-100 group-hover:w-24 transition-all duration-300`}
                  ></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
