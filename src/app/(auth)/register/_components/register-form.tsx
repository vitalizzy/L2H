"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputForm } from "@/components/ui/input/input-form";
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
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<RegisterValuesType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  async function handleRegister(values: RegisterValuesType) {
    setIsLoading(true);
    try {
      console.log("🔍 Registration attempt:", values.email);

      // Llamar a la ruta API de registro
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ Signup error:", result.error, "Status:", response.status);
        
        // Detectar si el usuario ya existe basándose en el mensaje de error de Supabase
        if (
          result.error?.includes("already registered") ||
          result.error?.includes("User already exists")
        ) {
          toast.error(t.register.userExists || "This email is already registered. Please login or use a different email.");
        } else if (response.status === 429) {
          toast.error("Too many registration attempts. Please try again later.");
        } else if (response.status === 400) {
          toast.error(result.error || "Invalid registration data");
        } else {
          toast.error(result.error || "Registration failed");
        }
        return;
      }

      console.log("✅ Signup successful");
      toast.success(t.register.verificationSent);
      router.replace("/confirm-signup");
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("An unexpected error occurred during registration");
    } finally {
      setIsLoading(false);
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

        <Button disabled={isLoading}>
          {isLoading ? "Registering..." : t.register.button}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
