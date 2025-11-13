import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const method = searchParams.get("method"); // 'google' for OAuth signup
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("code");
  redirectTo.searchParams.delete("method");

  // Handle OAuth callback (Google, etc.)
  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("OAuth callback - code:", code);
    console.log("OAuth callback - error:", error);
    console.log("OAuth callback - data:", data);
    console.log("OAuth method:", method);
    
    if (!error && data?.user) {
      const userEmail = data.user.email;
      console.log("OAuth user authenticated:", userEmail);
      
      // For Google OAuth signup (method=google), send verification email
      if (method === "google" && userEmail) {
        try {
          // Send OTP to the user's email for verification
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email: userEmail,
            options: {
              shouldCreateUser: false,
              emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
            },
          });
          
          if (!otpError) {
            console.log("Verification email sent to Google user:", userEmail);
            // Redirect to confirm-signup page
            redirectTo.pathname = "/confirm-signup";
            return NextResponse.redirect(redirectTo);
          } else {
            console.log("Failed to send verification email:", otpError.message);
          }
        } catch (emailError) {
          console.error("Error sending verification email:", emailError);
        }
      }
      
      return NextResponse.redirect(redirectTo);
    }
    
    if (error) {
      console.error("OAuth exchange failed:", error.message);
    }
  }

  // Handle email verification
  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
