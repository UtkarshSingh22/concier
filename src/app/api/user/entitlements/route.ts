// 🔒 CORE SYSTEM - DO NOT MODIFY
// API route to get current user's entitlements

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentUserEntitlements } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get entitlements data
    const entitlements = await getCurrentUserEntitlements();

    return NextResponse.json({
      entitlements,
    });
  } catch (error) {
    console.error("Failed to fetch entitlements:", error);
    return NextResponse.json(
      { error: "Failed to fetch entitlements" },
      { status: 500 }
    );
  }
}
