// 🏗️ USER EDITABLE - LANDING PAGE COMPONENT
// Customize this hero section to match your brand and messaging.
// This component is fully editable and part of your landing page.

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%2232%22 height=%2232%22 fill=%22none%22 stroke=%22rgb(148 163 184 / 0.1)%22%3E%3Cpath d=%22m0 .5 32 0%22/%3E%3Cpath d=%22m0 32.5 32 0%22/%3E%3Cpath d=%22m.5 0 0 32%22/%3E%3Cpath d=%22m32.5 0 0 32%22/%3E%3C/svg%3E')] opacity-40"></div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large blurred blobs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-green-400/20 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-teal-400/20 via-cyan-400/20 to-emerald-400/20 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-400/15 blur-2xl"></div>

        {/* Smaller accent dots */}
        <div className="absolute top-20 right-20 h-2 w-2 rounded-full bg-emerald-500/60"></div>
        <div className="absolute bottom-32 left-32 h-3 w-3 rounded-full bg-teal-500/60"></div>
        <div className="absolute top-40 left-40 h-1.5 w-1.5 rounded-full bg-green-500/60"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 text-sm font-medium text-emerald-700 mb-8">
            <Sparkles className="h-4 w-4" />
            Professional SaaS Platform
          </div>

          {/* Main headline */}
          <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-8xl lg:text-9xl xl:text-[10rem] leading-none">
            <span className="block bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
              Your
            </span>
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              SaaS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-xl leading-8 text-gray-600 sm:text-2xl lg:text-3xl font-medium max-w-3xl mx-auto">
            Streamline your workflow with our professional SaaS platform
            designed for modern teams.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <Link href="/auth">
              <Button
                size="lg"
                className="group w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-12 py-5 text-xl font-bold text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 sm:w-auto rounded-xl"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-3 border-gray-300/80 bg-white/80 backdrop-blur-sm px-12 py-5 text-xl font-bold text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/80 hover:shadow-xl transition-all duration-200 sm:w-auto rounded-xl"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Social proof hint */}
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-400 to-indigo-400"></div>
              </div>
              <span>Join 10,000+ teams</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
