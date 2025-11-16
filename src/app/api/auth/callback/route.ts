import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  console.log("[Auth Callback] Starting...", { token_hash: !!token_hash, type });

  const supabase = await createClient();
  const redirectTo = request.nextUrl.clone();

  // Handle email verification and password reset
  if (token_hash && type) {
    console.log("[Auth Callback] Processing magic link, type:", type);

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error("[Auth Callback] Magic link error:", error);
      redirectTo.pathname = "/(auth)/error";
      redirectTo.searchParams.set("error", error.message);
      return NextResponse.redirect(redirectTo);
    }

    console.log("[Auth Callback] Magic link verified, type:", type);

    // Route based on OTP type
    if (type === "signup") {
      // Email verification after signup - go to onboarding
      redirectTo.pathname = "/onboarding";
    } else if (type === "recovery") {
      // Password reset link - go to reset password page
      redirectTo.pathname = "/reset-password";
    } else {
      // Default email verification - go to home
      redirectTo.pathname = "/";
    }

    redirectTo.searchParams.delete("token_hash");
    redirectTo.searchParams.delete("type");
    redirectTo.searchParams.delete("code");
    return NextResponse.redirect(redirectTo);
  }

  // No valid callback parameters
  console.warn("[Auth Callback] No valid callback parameters found");
  redirectTo.pathname = "/(auth)/error";
  redirectTo.searchParams.set("error", "Invalid callback");
  return NextResponse.redirect(redirectTo);
}
