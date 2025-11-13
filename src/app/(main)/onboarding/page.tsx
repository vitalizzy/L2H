"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input/input-form";
import { Form } from "@/components/ui/form";
import { useLanguage } from "@/context/language-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";
import Image from "next/image";

const onboardingSchema = z.object({
  full_name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: "",
    },
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          router.push("/login");
          return;
        }

        // Check if user already completed onboarding
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          // User already has profile, go to home
          router.push("/");
          return;
        }

        setUserData({
          id: user.id,
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url,
          full_name: user.user_metadata?.full_name || "",
        });

        // Pre-fill form
        if (user.user_metadata?.full_name) {
          form.setValue("full_name", user.user_metadata.full_name);
        }
      } catch (error) {
        console.error("Error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [supabase, router, form]);

  const onSubmit = async (values: OnboardingValues) => {
    if (!userData) return;

    setIsSubmitting(true);
    try {
      // Update profile with user data
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
        })
        .eq("id", userData.id);

      if (error) {
        toast.error("Error al guardar perfil");
        return;
      }

      toast.success("¡Perfil completado!");
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <p className="text-muted-foreground">No se encontró usuario</p>
      </div>
    );
  }

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Completa tu Perfil</h1>
          <p className="mt-2 text-muted-foreground">
            Ayúdanos a personalizar tu experiencia
          </p>
        </div>

        {/* Avatar if exists */}
        {userData.avatar_url && (
          <div className="flex justify-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-border">
              <Image
                src={userData.avatar_url}
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email (read-only) */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg font-semibold">{userData.email}</p>
            </div>

            {/* Full Name */}
            <InputForm
              label="Nombre Completo"
              name="full_name"
              placeholder="Tu nombre"
              description="Cómo te llamas"
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? "Guardando..." : "Continuar"}
            </Button>
          </form>
        </Form>

        {/* Skip option */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            disabled={isSubmitting}
          >
            Omitir por ahora
          </Button>
        </div>
      </div>
    </div>
  );
}
