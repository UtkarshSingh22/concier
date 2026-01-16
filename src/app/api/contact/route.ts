// 🔒 CORE SYSTEM - DO NOT MODIFY
// Contact form API route with validation and email sending.
// Users should NOT edit this file. Build your product logic in /product instead.

import { NextRequest, NextResponse } from "next/server";
import { EmailService } from "@/lib/email";
import { logger } from "@/lib/logger";

// Simple in-memory rate limiting (production should use Redis/external service)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // 3 requests per minute

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

function validateContactRequest(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length < 2
  ) {
    errors.push("Name must be at least 2 characters long");
  }

  if (
    !data.email ||
    typeof data.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.push("Please provide a valid email address");
  }

  if (
    !data.message ||
    typeof data.message !== "string" ||
    data.message.trim().length < 10
  ) {
    errors.push("Message must be at least 10 characters long");
  }

  // Basic spam prevention - check for suspicious patterns
  if (
    (data.message && data.message.includes("<script")) ||
    data.message.includes("http://") ||
    data.message.includes("https://")
  ) {
    errors.push("Message contains invalid content");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime: number } {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // First request or window expired
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, resetTime: now + RATE_LIMIT_WINDOW };
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, resetTime: userLimit.resetTime };
  }

  // Increment count
  userLimit.count++;
  return { allowed: true, resetTime: userLimit.resetTime };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body: ContactRequest = await request.json();

    // Validate input
    const validation = validateContactRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors.join(", "),
        },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      message: body.message.trim(),
    };

    // Get admin email (use EMAIL_FROM or fallback)
    const adminEmail =
      process.env.SUPPORT_EMAIL ||
      process.env.EMAIL_FROM ||
      "admin@yoursaas.com";

    // Send email using existing email system
    const emailResult = await EmailService.sendContactFormMessage({
      fromName: sanitizedData.name,
      fromEmail: sanitizedData.email,
      subject: "General Inquiry",
      message: sanitizedData.message,
      adminEmail,
    });

    if (!emailResult.success) {
      logger.error("Failed to send contact email", {
        context: "contact-form",
        metadata: {
          error: emailResult.error,
          fromEmail: sanitizedData.email,
        },
      });
      
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send message. Please try again later.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(error as Error, {
      context: "contact-form",
      tags: { type: "unexpected_error" },
    });
    
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
