// 🔒 CORE SYSTEM - DO NOT MODIFY
// NextAuth.js configuration.
// Handles OAuth authentication with Google and Email Magic Links.

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

// Environment variables are validated at runtime when needed

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // Custom credentials provider for verified email sign-in
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        verified: { label: "Verified", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.verified === "true") {
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (user && user.emailVerified) {
            const userObject = {
              id: user.id,
              email: user.email,
              name: user.name,
            };
            return userObject;
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  callbacks: {
    session: async ({ session, token }) => {
      // Add user ID to session from JWT token
      if (session?.user && token?.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      // Ensure user ID is set in JWT token
      if (!token?.sub && user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    signIn: async ({ user, account }) => {
      // Allow credentials and Google OAuth
      if (
        account?.provider === "credentials" ||
        account?.provider === "google"
      ) {
        // Handle Google OAuth account linking
        if (account.provider === "google" && user?.email) {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          if (
            existingUser &&
            !existingUser.accounts.some((acc) => acc.provider === "google")
          ) {
            // Link Google account to existing user
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
          }
        }
        return true;
      }
      return false;
    },
  },
  events: {
    createUser: async ({ user }) => {
      console.log(`👤 New user created: ${user.email}`);
    },
    signIn: async ({ user, isNewUser }) => {
      console.log(
        `🔑 User signed in: ${user.email} (${isNewUser ? "new" : "existing"})`
      );
    },
  },
};
