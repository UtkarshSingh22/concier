// 🔒 CORE SYSTEM - DO NOT MODIFY
// Header component with user info and sign out functionality.
// Users should NOT edit this file. Build your product logic in /product instead.

"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth" });
  };

  if (status === "loading") {
    return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/product" className="text-xl font-bold text-gray-900">
              Your SaaS
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
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
                <span className="text-sm text-gray-700">
                  {session.user.name || session.user.email}
                </span>
              </div>
            )}

            <Button onClick={handleSignOut} size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
