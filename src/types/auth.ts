// Authentication Types
// Shared TypeScript types for auth system

import type { User } from "@supabase/supabase-js";

/**
 * User profile information stored in database
 */
export interface UserProfile {
  id: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Authentication session
 */
export interface AuthSession {
  user: User | null;
  session: any;
}

/**
 * Login form data
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Register form data
 */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

/**
 * Forgot password form data
 */
export interface ForgotPasswordFormData {
  email: string;
}

/**
 * Reset password form data
 */
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  success: boolean;
  error: string | null;
  data?: any;
}

/**
 * OAuth provider types - DEPRECATED
 * OAuth is no longer supported. Use Email/Password authentication only.
 */
export type OAuthProvider = never;

/**
 * Email verification types
 */
export type EmailVerificationType = "signup" | "recovery" | "email_change" | "change_email_new";

/**
 * Auth callback parameters
 */
export interface AuthCallbackParams {
  code?: string;
  token_hash?: string;
  type?: EmailVerificationType;
  error?: string;
  error_description?: string;
  error_code?: string;
}

/**
 * User creation event from Supabase trigger
 */
export interface UserCreatedEvent {
  record: {
    id: string;
    email: string;
    raw_user_meta_data: {
      full_name?: string;
    };
    email_confirmed_at?: string;
  };
}

/**
 * Auth error types
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  INVALID_EMAIL = "INVALID_EMAIL",
  PASSWORD_TOO_SHORT = "PASSWORD_TOO_SHORT",
  EMAIL_NOT_CONFIRMED = "EMAIL_NOT_CONFIRMED",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  OAUTH_ERROR = "OAUTH_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Auth error with type
 */
export interface AuthError {
  type: AuthErrorType;
  message: string;
  originalError?: Error;
}

/**
 * Redirect after auth
 */
export interface AuthRedirect {
  pathname: string;
  searchParams?: Record<string, string>;
}
