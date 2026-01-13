// 🔒 CORE SYSTEM - DO NOT MODIFY
// Magic link verification endpoint
// Handles the magic link click and signs the user in

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/auth?error=InvalidLink", request.url)
      );
    }

    // Verify token exists and is not expired
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        identifier: email,
        token: token,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/auth?error=ExpiredLink", request.url)
      );
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          role: "user",
          emailVerified: new Date(),
        },
      });
    }

    // Delete the used token
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    });

    // Mark user as verified (if not already)
    if (!user.emailVerified) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    }

    // Redirect to the verify page where NextAuth signIn will be called
    const verifyUrl = new URL("/auth/verify", request.url);
    verifyUrl.searchParams.set("email", email);
    verifyUrl.searchParams.set("verified", "true");

    return NextResponse.redirect(verifyUrl);
  } catch (error) {
    console.error("Magic link verification error:", error);
    return NextResponse.redirect(
      new URL("/auth?error=VerificationFailed", request.url)
    );
  }
}
