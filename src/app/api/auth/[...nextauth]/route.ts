// 🔒 CORE SYSTEM - DO NOT MODIFY
// NextAuth.js API route handler for authentication.
// This handles all auth-related API calls (signin, signout, session, etc.)

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
