"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input/input-form";
import { Form } from "@/components/ui/form";
import { useLanguage } from "@/context/language-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";
import Link from "next/link";
import { ChevronLeftCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const forgotPasswordSchema = z.object({
  email: z.string().email("Correo inválido"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsSubmitting(true);
    try {
      // Send reset link
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Email de recuperación enviado. Revisa tu bandeja de entrada.");
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Button variant="outline" asChild>
        <Link href="/login" className={cn("absolute left-4 top-4")}>
          <ChevronLeftCircle className="mr-2 h-4 w-4" />
          Volver
        </Link>
      </Button>

      <div className="mx-auto max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Recuperar Contraseña</h1>
          <p className="mt-2 text-muted-foreground">
            Ingresa tu correo para recibir un enlace de recuperación
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InputForm
              label="Correo Electrónico"
              name="email"
              placeholder="tu@email.com"
              type="email"
              required
            />

            <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
              {isSubmitting ? "Enviando..." : "Enviar Enlace"}
            </Button>
          </form>
        </Form>

        {/* Auth Error Message */}
        {userProvider && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-sm font-medium text-destructive">
              Parece que tu cuenta usa {userProvider === "google" ? "Google" : "LinkedIn"}.
              <br />
              Por favor inicia sesión con ese botón en la página de login.
            </p>
            <Button variant="outline" asChild className="mt-4 w-full">
              <Link href="/login">Volver al Login</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
