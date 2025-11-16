import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting (replace with Redis in production)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(email);

  if (!attempt || now > attempt.resetTime) {
    // Reset or create new entry
    loginAttempts.set(email, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return true;
  }

  if (attempt.count >= 5) {
    return false; // Too many attempts
  }

  attempt.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validar que los datos estén presentes
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const supabase = await createClient();

    // Intentar login con email y password
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Login error:", error.message);
      
      // Devolver error genérico para no revelar si el email existe
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("✅ Login successful for:", email);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Login route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
