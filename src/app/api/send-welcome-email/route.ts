// API route for testing the welcome email functionality
// Sends a welcome email to the current user

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EmailService } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userEmail, userName } = await request.json();

    // Basic validation
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    console.log("📧 Attempting to send welcome email to:", userEmail);

    // Send welcome email
    const result = await EmailService.sendWelcomeEmail({
      to: userEmail,
      userName: userName || "there",
      loginUrl: `${process.env.NEXTAUTH_URL}/auth`,
    });

    if (!result.success) {
      console.error("❌ Failed to send welcome email:", result.error);
      console.error("Error details:", result);
      return NextResponse.json(
        { error: `Failed to send welcome email: ${result.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully!",
    });
  } catch (error) {
    console.error("Send welcome email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
