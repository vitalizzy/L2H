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

  const supabase = createClient();

  const form = useForm<LoginValuesType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  });

  async function handleLogin(values: LoginValuesType) {
    try {
      console.log("🔍 Login attempt:", values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword(values);

      if (error) {
        console.error("❌ Auth error:", error.message, error.status);
        toast.error(error.message);
        return;
      }

      console.log("✅ Login successful");
      toast.success(t.login.loginSuccess);
      router.refresh();
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("An unexpected error occurred");
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

        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button>{t.login.button}</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
