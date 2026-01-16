// API route for testing the welcome email functionality
// Sends a welcome email to the current user

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EmailService } from "@/lib/email";
import { withErrorHandler, createErrorResponse } from "@/lib/error-handler";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  return withErrorHandler(
    async () => {
      // Get authenticated user
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return createErrorResponse("Unauthorized", 401, "AUTH_REQUIRED");
      }

      const { userEmail, userName } = await request.json();

      // Basic validation
      if (!userEmail) {
        return createErrorResponse(
          "User email is required",
          400,
          "VALIDATION_ERROR"
        );
      }

      logger.info("Sending welcome email", {
        context: "welcome-email",
        metadata: { to: userEmail },
      });

      // Send welcome email
      const result = await EmailService.sendWelcomeEmail({
        to: userEmail,
        userName: userName || "there",
        loginUrl: `${process.env.NEXTAUTH_URL}/auth`,
      });

      if (!result.success) {
        logger.error("Failed to send welcome email", {
          context: "welcome-email",
          metadata: { error: result.error, to: userEmail },
        });

        return createErrorResponse(
          `Failed to send welcome email: ${result.error}`,
          500,
          "EMAIL_SEND_FAILED"
        );
      }

      return NextResponse.json({
        success: true,
        message: "Welcome email sent successfully!",
      });
    },
    {
      context: "welcome-email",
      tags: { type: "email" },
    }
  );
}
