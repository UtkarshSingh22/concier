// 🏗️ USER EDITABLE - LANDING PAGE COMPONENT
// Customize the final call-to-action section and messaging.
// This component is fully editable and part of your landing page.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Loader2 } from "lucide-react";

export function CallToAction() {
  const router = useRouter();
  const { status } = useSession();
  const [isNavigating, setIsNavigating] = useState(false);
  const isAuthenticated = status === "authenticated";
  const ctaLink = isAuthenticated ? "/product" : "/auth";

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    router.push(ctaLink);
  };

  return (
    <>
      {/* Full-page loading overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900">
              Loading your dashboard...
            </p>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </div>
        </div>
      )}

      <section className="relative bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 py-24 sm:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large gradient orbs */}
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-400/30 blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-gradient-to-br from-teal-400/30 to-green-400/30 blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%2232%22 height=%2232%22 fill=%22none%22 stroke=%22rgb(255 255 255 / 0.03)%22%3E%3Cpath d=%22m0 .5 32 0%22/%3E%3Cpath d=%22m0 32.5 32 0%22/%3E%3Cpath d=%22m.5 0 0 32%22/%3E%3Cpath d=%22m32.5 0 0 32%22/%3E%3C/svg%3E')] opacity-30"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 text-sm font-medium text-white mb-8">
              <Zap className="h-5 w-5" />
              Join 10,000+ Teams Already Using Your SaaS
            </div>

            {/* Main headline */}
            <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Ready to{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 bg-clip-text text-transparent">
                Transform
              </span>{" "}
              Your Workflow?
            </h2>

            {/* Subtitle */}
            <p className="mt-8 text-xl leading-8 text-gray-300 sm:text-2xl max-w-3xl mx-auto">
              Start your free trial today and experience the difference
              professional SaaS can make.
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={handleCtaClick}
                disabled={isNavigating}
                className="group w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-12 py-6 text-xl font-bold text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 sm:w-auto rounded-2xl disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isNavigating ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/pricing");
                }}
                disabled={isNavigating}
                className="w-full border-3 border-white/40 bg-white/5 backdrop-blur-sm px-12 py-6 text-xl font-bold text-white hover:bg-white/10 hover:border-white/60 transition-all duration-300 sm:w-auto rounded-2xl disabled:opacity-50"
              >
                View All Plans
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-2">30-Day</div>
                <div className="text-gray-300">Free Trial</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-2">
                  No Card
                </div>
                <div className="text-gray-300">Required</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-2">5-Min</div>
                <div className="text-gray-300">Setup</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
