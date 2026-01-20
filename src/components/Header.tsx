// 🏗️ USER EDITABLE - HEADER COMPONENT
// Customize branding, navigation links, and styling.
// Safe to edit: Logo text, styling, additional nav links.
// Core functionality (auth state, sign out) should remain intact.

"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth" });
  };

  if (status === "loading") {
    return (
      <header className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="animate-pulse h-8 w-32 bg-muted rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse h-8 w-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/product" className="text-xl font-bold text-foreground">
              {process.env.NEXT_PUBLIC_APP_NAME || "Your SaaS"}
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            {session?.user && (
              <>
                {pathname === "/billing" ? (
                  <Link href="/product">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="inline-flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/billing">
                    <Button variant="ghost" size="sm">
                      Billing
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  {session.user.image && (
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                    />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {session.user.name || session.user.email}
                  </span>
                </div>
              </>
            )}

            <ThemeToggle />

            <Button onClick={handleSignOut} size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
