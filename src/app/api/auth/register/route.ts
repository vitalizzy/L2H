import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

    const supabase = await createClient();
    const redirectUrl = `${request.nextUrl.origin}/api/auth/callback`;

    // Intentar registrar el usuario directamente con Supabase
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    // Si hay error, devolverlo al cliente
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Si es exitoso, devolver los datos
    return NextResponse.json(
      { 
        success: true, 
        data: {
          user: data.user,
          session: data.session,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Register route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
