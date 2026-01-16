// 🏗️ USER EDITABLE - PRICING PAGE
// Customize pricing plans, features, and design.
// This page is fully editable - modify plans, pricing, and styling.

import type { Metadata } from "next";
import Link from "next/link";
import { createStaticPageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Crown, Star, Zap } from "lucide-react";
import { LandingNav } from "@/components/landing";

export const metadata: Metadata = createStaticPageMetadata(
  "Pricing",
  "Choose the perfect plan for your business needs."
);

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Up to 3 team members",
      "Basic workflow automation",
      "Standard support",
      "1GB storage",
    ],
    cta: "Get Started",
    ctaHref: "/auth",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For growing teams",
    features: [
      "Up to 25 team members",
      "Advanced workflow automation",
      "Priority support",
      "100GB storage",
      "Custom integrations",
      "Analytics dashboard",
    ],
    cta: "Start Free Trial",
    ctaHref: "/auth",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Unlimited team members",
      "Full platform access",
      "Dedicated support",
      "Unlimited storage",
      "Custom integrations",
      "Advanced analytics",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    ctaHref: "/contact",
    popular: false,
  },
];

const PricingPage = () => {
  return (
    <div className="relative bg-background min-h-screen overflow-hidden">
      <LandingNav />
      <div className="pt-24 pb-24 sm:pt-32 sm:pb-32 lg:pt-40 lg:pb-40">
        {/* Enhanced decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large gradient orbs */}
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-200/20 via-teal-200/20 to-green-200/20 dark:from-emerald-400/10 dark:via-teal-400/10 dark:to-green-400/10 blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-teal-200/20 via-cyan-200/20 to-emerald-200/20 dark:from-teal-400/10 dark:via-cyan-400/10 dark:to-emerald-400/10 blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>

          {/* Floating accent elements */}
          <div className="absolute top-1/4 right-20 h-4 w-4 rounded-full bg-emerald-400/60 animate-bounce"></div>
          <div
            className="absolute bottom-1/3 left-20 h-3 w-3 rounded-full bg-teal-400/60 animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-2/3 right-32 h-2 w-2 rounded-full bg-green-400/60 animate-bounce"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%2232%22 height=%2232%22 fill=%22none%22 stroke=%22rgb(148 163 184 / 0.05)%22%3E%3Cpath d=%22m0 .5 32 0%22/%3E%3Cpath d=%22m0 32.5 32 0%22/%3E%3Cpath d=%22m.5 0 0 32%22/%3E%3Cpath d=%22m32.5 0 0 32%22/%3E%3C/svg%3E')] opacity-60 dark:opacity-30"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Badge */}
          <div className="mx-auto max-w-2xl text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 px-6 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50">
              <Star className="h-4 w-4" />
              No Hidden Fees • Cancel Anytime
            </div>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-6xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-muted-foreground sm:text-2xl max-w-3xl mx-auto">
              Start free, upgrade anytime. All plans include our core features
              with 30-day money-back guarantee.
            </p>
          </div>

          <div className="mx-auto mt-20 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative ${plan.popular ? "mt-6" : ""}`}
                >
                  <Card
                    className={`group relative transition-all duration-500 hover:shadow-3xl hover:-translate-y-4 ${
                      plan.popular
                        ? "ring-4 ring-emerald-500/50 shadow-2xl scale-105 bg-card"
                        : "shadow-xl bg-card hover:shadow-2xl overflow-hidden"
                    }`}
                  >
                    {/* Crown badge for popular plan - positioned inside card to move with hover */}
                    {plan.popular && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 transition-transform duration-500 group-hover:-translate-y-1">
                        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-6 py-3 text-sm font-bold text-white shadow-2xl">
                          <Crown className="h-4 w-4" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Premium gradient borders and effects */}
                    {plan.popular && (
                      <>
                        {/* Animated gradient border */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 p-[2px] opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="h-full w-full rounded-lg bg-card"></div>
                        </div>

                        {/* Subtle inner glow */}
                        <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-green-50/20 dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-green-900/10 opacity-60"></div>
                      </>
                    )}

                    {/* Plan icon in corner for non-popular plans */}
                    {!plan.popular && (
                      <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                        <Zap className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}

                    <CardHeader className="relative text-center pb-10 pt-8">
                      <CardTitle
                        className={`text-3xl font-bold ${
                          plan.popular
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
                            : "text-card-foreground"
                        }`}
                      >
                        {plan.name}
                      </CardTitle>

                      <div className="mt-8">
                        <div className="flex items-baseline justify-center gap-1">
                          {plan.price === "Custom" ? (
                            <span className="text-6xl font-bold text-card-foreground">
                              Custom
                            </span>
                          ) : (
                            <>
                              <span className="text-6xl font-bold text-card-foreground">
                                {plan.price}
                              </span>
                              <span className="text-xl text-muted-foreground font-medium">
                                /month
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <CardDescription className="mt-6 text-lg text-muted-foreground max-w-xs mx-auto">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative px-8">
                      <ul className="space-y-5">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={feature}
                            className="flex items-start gap-x-4"
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 mt-0.5 flex-shrink-0">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-muted-foreground leading-relaxed text-base">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="relative pt-10 pb-8 px-8">
                      <Link href={plan.ctaHref} className="w-full">
                        <Button
                          className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                            plan.popular
                              ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-2xl hover:shadow-3xl hover:from-emerald-700 hover:via-teal-700 hover:to-green-700"
                              : "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl hover:shadow-2xl hover:from-gray-800 hover:to-gray-700"
                          }`}
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Trust indicators section */}
          <div className="mx-auto mt-24 max-w-6xl">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Trusted by Teams Worldwide
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of companies already streamlining their workflows
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    50K+
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Active Users
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-2xl p-8 border border-purple-100 dark:border-purple-800">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    99.9%
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Uptime SLA
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    24/7
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Expert Support
                  </div>
                </div>
              </div>
            </div>

            {/* Final CTA section */}
            <div className="bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full translate-y-24 -translate-x-24"></div>
              </div>

              <div className="relative">
                <h3 className="text-4xl font-bold mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                  Start your free trial today. No credit card required. Upgrade
                  anytime.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/auth">
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                      Start Free Trial
                    </Button>
                  </Link>
                  <div className="text-sm text-white/60">
                    ✓ 30-day free trial • ✓ No setup fees • ✓ Cancel anytime
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
