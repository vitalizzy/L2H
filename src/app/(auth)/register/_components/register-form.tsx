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

export const registerFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterValuesType = z.infer<typeof registerFormSchema>;

const defaultValues: RegisterValuesType = {
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm = () => {
  const router = useRouter();
  const { t } = useLanguage();

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
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${redirectUrl}/api/auth/callback`,
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

        <InputForm
          type="password"
          label={t.register.confirmPassword || "Confirm Password"}
          name="confirmPassword"
          description=""
          required
        />

        <Button>{t.register.button}</Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
