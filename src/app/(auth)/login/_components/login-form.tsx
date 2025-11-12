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

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type LoginValuesType = z.infer<typeof loginFormSchema>;

const defaultValues: LoginValuesType = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const supabase = createClient();

  const form = useForm<LoginValuesType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  });

  async function handleLogin(values: LoginValuesType) {
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) return toast.error(error.message);

    toast.success(t.login.loginSuccess);

    router.refresh();
  }

  async function handleGoogleLogin() {
    setIsLoadingGoogle(true);
    try {
      const redirectUrl = typeof window !== "undefined" 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectUrl}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("Error signing in with Google");
    } finally {
      setIsLoadingGoogle(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLogin)}
        className="w-full flex flex-col gap-y-4"
      >
        <InputForm
          label={t.login.email}
          name="email"
          placeholder="hello@example.com"
          description=""
          required
        />

        <InputForm
          type="password"
          label={t.login.password}
          name="password"
          description=""
          required
        />

        <Button>{t.login.button}</Button>

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
          onClick={handleGoogleLogin}
          disabled={isLoadingGoogle}
          className="w-full"
        >
          {isLoadingGoogle ? "Signing in..." : "Continue with Google"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
