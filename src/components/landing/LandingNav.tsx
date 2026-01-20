// 🏗️ USER EDITABLE - LANDING PAGE NAVIGATION
// Customize branding, navigation links, and styling.
// Safe to edit: Logo text, styling, navigation links.

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2 } from "lucide-react";

export function LandingNav() {
  const router = useRouter();
  const { status } = useSession();
  const [isNavigating, setIsNavigating] = useState(false);
  const isAuthenticated = status === "authenticated";

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    router.push("/product");
  };

  return (
    <>
      {/* Full-page loading overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground">
              Loading your dashboard...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please wait a moment
            </p>
          </div>
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-foreground">
                {process.env.NEXT_PUBLIC_APP_NAME || "Your SaaS"}
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Right Side: Theme Toggle + CTA */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />

              {isAuthenticated ? (
                <Button
                  size="sm"
                  className="font-medium"
                  onClick={handleDashboardClick}
                  disabled={isNavigating}
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Dashboard"
                  )}
                </Button>
              ) : (
                <Link href="/auth">
                  <Button size="sm" className="font-medium">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
