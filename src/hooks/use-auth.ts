// Authentication Hooks
// Custom React hooks for auth operations

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  UserProfile,
  AuthError,
  AuthErrorType as AuthErrorTypeType,
} from "@/types/auth";
import { AuthErrorType } from "@/types/auth";

/**
 * Parse Supabase error into AuthError
 */
function parseAuthError(error: any): AuthError {
  const message = error?.message || "An unexpected error occurred";
  
  let type: AuthErrorType;
  
  if (message.includes("Invalid login credentials")) {
    type = AuthErrorType.INVALID_CREDENTIALS;
  } else if (message.includes("User not found")) {
    type = AuthErrorType.USER_NOT_FOUND;
  } else if (message.includes("already registered")) {
    type = AuthErrorType.USER_ALREADY_EXISTS;
  } else if (message.includes("Invalid email")) {
    type = AuthErrorType.INVALID_EMAIL;
  } else if (message.includes("password should be")) {
    type = AuthErrorType.PASSWORD_TOO_SHORT;
  } else if (message.includes("Email not confirmed")) {
    type = AuthErrorType.EMAIL_NOT_CONFIRMED;
  } else if (message.includes("session")) {
    type = AuthErrorType.SESSION_EXPIRED;
  } else if (message.includes("oauth")) {
    type = AuthErrorType.OAUTH_ERROR;
  } else {
    type = AuthErrorType.UNKNOWN_ERROR;
  }
  
  return {
    type,
    message,
    originalError: error,
  };
}

/**
 * Hook for user login
 */
export function useLogin() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const login = useCallback(
    async (data: LoginFormData) => {
      try {
        setLoading(true);
        setError(null);

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) {
          throw signInError;
        }

        router.push("/");
      } catch (err) {
        const authError = parseAuthError(err);
        setError(authError);
        throw authError;
      } finally {
        setLoading(false);
      }
    },
    [router, supabase]
  );

  return { login, loading, error };
}

/**
 * Hook for user signup
 */
export function useSignUp() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const signUp = useCallback(
    async (data: RegisterFormData) => {
      try {
        setLoading(true);
        setError(null);

        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
            },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        return { success: true };
      } catch (err) {
        const authError = parseAuthError(err);
        setError(authError);
        throw authError;
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  return { signUp, loading, error };
}

/**
 * Hook for password reset request
 */
export function useForgotPassword() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const resetPassword = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        setError(null);

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          data.email,
          {
            redirectTo: `${window.location.origin}/api/auth/callback`,
          }
        );

        if (resetError) {
          throw resetError;
        }

        return { success: true };
      } catch (err) {
        const authError = parseAuthError(err);
        setError(authError);
        throw authError;
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  return { resetPassword, loading, error };
}

/**
 * Hook for updating password
 */
export function useUpdatePassword() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const updatePassword = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        setLoading(true);
        setError(null);

        const { error: updateError } = await supabase.auth.updateUser({
          password: data.password,
        });

        if (updateError) {
          throw updateError;
        }

        // Sign out user
        await supabase.auth.signOut();
        router.push("/login");

        return { success: true };
      } catch (err) {
        const authError = parseAuthError(err);
        setError(authError);
        throw authError;
      } finally {
        setLoading(false);
      }
    },
    [router, supabase]
  );

  return { updatePassword, loading, error };
}

/**
 * Hook for user profile
 */
export function useProfile() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        setProfile(data);
        return data;
      } catch (err) {
        const message = (err as any)?.message || "Failed to fetch profile";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const updateProfile = useCallback(
    async (userId: string, updates: Partial<UserProfile>) => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: updateError } = await supabase
          .from("profiles")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        setProfile(data);
        return data;
      } catch (err) {
        const message = (err as any)?.message || "Failed to update profile";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  return {
    fetchProfile,
    updateProfile,
    loading,
    error,
    profile,
  };
}

/**
 * Hook for signout
 */
export function useSignOut() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  return { signOut, loading };
}

/**
 * Hook for OAuth signup
 */
export function useOAuthSignUp() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const signUpWithOAuth = useCallback(
    async (provider: "google" | "github") => {
      throw new Error("OAuth is no longer supported. Please use email/password authentication.");
    },
    []
  );

  return { signUpWithOAuth, loading, error };
}
