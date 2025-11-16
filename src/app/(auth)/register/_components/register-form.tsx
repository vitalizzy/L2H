"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputForm } from "@/components/ui/input/input-form";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "@/context/language-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useState } from "react";

export const registerFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type RegisterValuesType = z.infer<typeof registerFormSchema>;

const defaultValues: RegisterValuesType = {
  email: "",
  password: "",
};

const RegisterForm = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const supabase = createClient();

  const form = useForm<RegisterValuesType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  async function handleRegister(values: RegisterValuesType) {
    try {
      const redirectUrl = typeof window !== "undefined" 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      console.log("🔍 Registration attempt:", values.email);

      const { error, data } = await supabase.auth.signUp({
        ...values,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/callback`,
        },
      });

      if (error) {
        console.error("❌ Signup error:", error.message, error.status);
        toast.error(error.message);
        return;
      }

      console.log("✅ Signup successful, user data:", data);
      toast.success(t.register.verificationSent);
      router.replace("/confirm-signup");
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("An unexpected error occurred during registration");
    }
  }

  async function handleGoogleRegister() {
    setIsLoadingGoogle(true);
    try {
      const redirectUrl = typeof window !== "undefined" 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      
      console.log("🔍 Google OAuth redirect URL:", redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectUrl}/auth/callback?signup=true`,
        },
      });

      if (error) {
        console.error("❌ OAuth error:", error.message);
        toast.error(error.message);
      }
    } catch (error) {
      console.error("❌ OAuth unexpected error:", error);
      toast.error("Error signing up with Google");
    } finally {
      setIsLoadingGoogle(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className="w-full flex flex-col gap-y-4"
      >
        <InputForm
          label={t.register.email}
          name="email"
          placeholder={t.register.emailPlaceholder}
          description=""
          required
        />

        <InputForm
          type="password"
          label={t.register.password}
          name="password"
          description=""
          required
        />

        <Button>{t.register.button}</Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleRegister}
          disabled={isLoadingGoogle}
          className="w-full"
        >
          {isLoadingGoogle ? "Signing up..." : "Sign up with Google"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
