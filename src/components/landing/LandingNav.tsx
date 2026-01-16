// 🏗️ USER EDITABLE - LANDING PAGE NAVIGATION
// Customize branding, navigation links, and styling.
// Safe to edit: Logo text, styling, navigation links.

"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function LandingNav() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-foreground">Your SaaS</span>
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
              <Link href="/product">
                <Button size="sm" className="font-medium">
                  Dashboard
                </Button>
              </Link>
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
  );
}
