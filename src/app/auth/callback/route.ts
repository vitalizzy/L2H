import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const signup = searchParams.get("signup"); // 'true' if coming from signup page
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("code");
  redirectTo.searchParams.delete("signup");

  // Handle magic link verification (from email)
  if (token_hash && type) {
    const supabase = await createClient();
    console.log("Magic link verification - token_hash:", token_hash, "type:", type);

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && data?.user) {
      console.log("Magic link verified for user:", data.user.email);
      redirectTo.pathname = "/";
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }

    if (error) {
      console.error("Magic link verification failed:", error.message);
    }
  }

  // Handle OAuth callback (Google, etc.)
  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("OAuth callback - code:", code);
    console.log("OAuth callback - error:", error);
    console.log("OAuth callback - data:", data);
    console.log("OAuth signup flag:", signup);
    
    if (!error && data?.user) {
      const userEmail = data.user.email;
      console.log("OAuth user authenticated:", userEmail);
      
      // If signup parameter is true, this is a new registration
      // Redirect to confirm-signup for email verification
      if (signup === "true") {
        console.log("New user signup via OAuth");
        redirectTo.pathname = "/confirm-signup";
      } else {
        // Existing user login - redirect to home
        console.log("Existing user login via OAuth");
        redirectTo.pathname = "/";
      }
      
      return NextResponse.redirect(redirectTo);
    }
    
    if (error) {
      console.error("OAuth exchange failed:", error.message);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
