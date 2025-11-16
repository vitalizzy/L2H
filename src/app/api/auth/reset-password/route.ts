import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password, confirmPassword } = await request.json();

    // Validar que los datos estén presentes
    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: "Password and confirmation are required" },
        { status: 400 }
      );
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Validar longitud mínima
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Obtener la sesión actual (debe haber token válido en cookies)
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("❌ No valid session found");
      return NextResponse.json(
        { error: "Invalid or expired session. Please request a new password reset link." },
        { status: 401 }
      );
    }

    // Actualizar la contraseña del usuario
    const { error, data } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("❌ Password update error:", error.message);
      return NextResponse.json(
        { error: error.message || "Failed to update password" },
        { status: 400 }
      );
    }

    console.log("✅ Password updated successfully for user:", data.user?.email);

    // Cerrar sesión del usuario después de cambiar contraseña
    await supabase.auth.signOut();

    return NextResponse.json(
      {
        success: true,
        message: "Password updated successfully. Please login with your new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Reset password route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
