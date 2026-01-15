// 🏗️ USER EDITABLE - LANDING PAGE COMPONENT
// Customize the step-by-step process and timeline design.
// This component is fully editable and part of your landing page.

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Settings, Link, Rocket, ChevronDown } from "lucide-react";

const steps = [
  {
    step: "01",
    name: "Set Up Your Account",
    description: "Create your account and configure your workspace settings in minutes.",
    icon: Settings,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    step: "02",
    name: "Connect Your Tools",
    description: "Integrate with your existing tools and import your data seamlessly.",
    icon: Link,
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    step: "03",
    name: "Start Working",
    description: "Begin using the platform to streamline your workflows immediately.",
    icon: Rocket,
    gradient: "from-green-500 to-emerald-500",
  },
];

export function HowItWorks() {
  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-emerald-50/40 py-24 sm:py-32 overflow-hidden">
      {/* Background timeline line for desktop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
        <div className="relative">
          <div className="h-0.5 w-[600px] bg-gradient-to-r from-emerald-200 via-teal-200 to-green-200"></div>
          <div className="absolute -top-1 left-1/4 w-3 h-3 rounded-full bg-emerald-500"></div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-500"></div>
          <div className="absolute -top-1 right-1/4 w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-200/20 blur-2xl"></div>
        <div className="absolute bottom-20 left-20 h-40 w-40 rounded-full bg-gradient-to-br from-teal-200/20 to-green-200/20 blur-2xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            How It{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps and transform your workflow today.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-6xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.step} className="relative group mt-12">
                {/* Step number badge - positioned at container level */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 transition-transform duration-500 group-hover:-translate-y-1">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-white font-bold text-lg shadow-xl transition-transform duration-300 group-hover:scale-110`}>
                    {step.step}
                  </div>
                </div>

                <Card className="relative border-0 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  {/* Gradient top border */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient}`}></div>

                  <CardContent className="p-8 pt-12 text-center">
                    <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                      {step.name}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <div className="mx-auto mt-8 flex justify-center md:hidden">
                    <ChevronDown className="h-8 w-8 text-gray-400 animate-bounce" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
