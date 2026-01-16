// 🔒 CORE SYSTEM - DO NOT MODIFY
// Custom magic link authentication API
// Completely bypasses NextAuth EmailProvider and Nodemailer
// Uses Resend directly for reliable email delivery

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import crypto from "crypto";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user exists, create if not
    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          role: "user",
          emailVerified: null, // Will be verified when they click the link
        },
      });
    }

    // Generate secure token (valid for 24 hours)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token in database
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Generate magic link URL
    const magicLink = `${process.env.NEXTAUTH_URL}/api/auth/magic-link/verify?token=${token}&email=${encodeURIComponent(email)}`;

    // Send email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Sign in to your account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Sign in to your account</h2>
          <p>Click the link below to sign in to your account:</p>
          <a href="${magicLink}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">
            Sign in
          </a>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours.
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Magic link sent successfully",
    });
  } catch (error) {
    logger.error(error as Error, {
      context: "magic-link",
      tags: { auth_method: "magic_link" },
    });

    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    );
  }
}
