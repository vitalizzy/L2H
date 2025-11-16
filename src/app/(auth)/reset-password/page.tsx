"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input/input-form";
import { Form } from "@/components/ui/form";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/language-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ChevronLeftCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Verificar que hay token válido en la URL
    const hash = window.location.hash;
    console.log("[Reset Password] Hash:", hash);

    if (hash.includes("access_token")) {
      setHasValidToken(true);
    } else {
      console.warn("[Reset Password] No valid access token found");
      toast.error("Invalid or expired reset link");
      setTimeout(() => router.push("/login"), 2000);
    }
  }, [router]);

  async function handleResetPassword(
    data: ResetPasswordFormValues
  ) {
    if (!hasValidToken) {
      toast.error("Session expired, please request a new password reset");
      return;
    }

    setIsLoading(true);

    try {
      // Llamar a la ruta API de reset-password
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("[Reset Password] Error:", result.error);
        toast.error(result.error || "Failed to update password");
        return;
      }

      console.log("[Reset Password] Success");
      toast.success("Password updated successfully!");

      // Redirect to login after successful password reset
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      console.error("[Reset Password] Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  if (!hasValidToken) {
    return (
      <section className="container flex h-screen flex-col items-center justify-center">
        <div className="mx-auto max-w-80">
          <p className="text-center text-sm text-muted-foreground">
            Validating your reset link...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container flex h-screen flex-col items-center justify-center">
      <Button variant="outline" asChild>
        <Link href="/login" className={cn("absolute left-4 top-4")}>
          <ChevronLeftCircle className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <div className="mx-auto max-w-80 flex flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleResetPassword)}
            className="space-y-4"
          >
            <InputForm
              type="password"
              label="New Password"
              name="password"
              placeholder="••••••••"
              description=""
              required
            />

            <InputForm
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="••••••••"
              description=""
              required
            />

            <Button disabled={isLoading} className="w-full">
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>

        <p className="px-8 text-center text-xs text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
