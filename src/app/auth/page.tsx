// 🔒 CORE SYSTEM - DO NOT MODIFY
// Authentication page with OAuth providers.
// Users should NOT edit this file. Build your product logic in /product instead.

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

const AuthPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/product");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
