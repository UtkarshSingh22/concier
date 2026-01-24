// 🏗️ USER EDITABLE - AUTHENTICATION PAGE
// Customize the styling and layout of the authentication page.
// The core authentication functionality should remain intact.

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";
import { LandingNav } from "@/components/landing";

const AuthPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/product");
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
