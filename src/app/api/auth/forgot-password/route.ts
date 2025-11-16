import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting for password reset requests
const resetRequests = new Map<string, { count: number; resetTime: number }>();

function checkResetRateLimit(email: string): boolean {
  const now = Date.now();
  const attempt = resetRequests.get(email);

  if (!attempt || now > attempt.resetTime) {
    // Reset or create new entry (allow 3 requests per hour)
    resetRequests.set(email, { count: 1, resetTime: now + 60 * 60 * 1000 }); // 1 hour
    return true;
  }

  if (attempt.count >= 3) {
    return false; // Too many requests
  }

  attempt.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validar que el email esté presente
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Rate limiting
    if (!checkResetRateLimit(email)) {
      return NextResponse.json(
        { error: "Too many password reset requests. Please try again later." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const redirectUrl = `${request.nextUrl.origin}/api/auth/callback`;

    // Enviar email de recuperación
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectUrl}?type=recovery`,
    });

    if (error) {
      console.error("❌ Reset password email error:", error.message);
      
      // NO revelar si el email existe o no (por seguridad)
      return NextResponse.json(
        {
          success: true,
          message: "If an account exists with this email, you will receive a password reset link.",
        },
        { status: 200 }
      );
    }

    console.log("✅ Password reset email sent to:", email);

    // Devolver respuesta exitosa sin confirmar si el email existe
    return NextResponse.json(
      {
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Forgot password route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
