// 🔒 CORE SYSTEM - DO NOT MODIFY
// Authentication page with OAuth providers.
// Users should NOT edit this file. Build your product logic in /product instead.

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
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
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
