import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    try {
      await db.waitlist.create({ data: { email } });
      return NextResponse.json(
        { success: true, message: "You're on the list.", alreadyOnList: false },
        { status: 200 }
      );
    } catch (err: unknown) {
      const isPrisma = err && typeof err === "object" && "code" in err;
      if (isPrisma && (err as { code: string }).code === "P2002") {
        return NextResponse.json(
          {
            success: true,
            message: "You're already on the list.",
            alreadyOnList: true,
          },
          { status: 200 }
        );
      }
      throw err;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[waitlist] Error:", message, error);
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        success: false,
        error: isDev
          ? `Something went wrong: ${message}`
          : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
