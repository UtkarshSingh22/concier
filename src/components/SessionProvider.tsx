// 🔒 CORE SYSTEM - DO NOT MODIFY
// NextAuth SessionProvider wrapper for client-side session management.
// Users should NOT edit this file. Build your product logic in /product instead.

"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};
