"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";
import toast from "react-hot-toast";
import { LogOut, Mail, User } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  provider: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          toast.error("No estás autenticado");
          router.push("/login");
          return;
        }

        // Get profile data
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          // If profile doesn't exist, create it from user data
          setProfile({
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            provider: user.user_metadata?.provider || null,
          });
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error al cargar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Sesión cerrada");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error al cerrar sesión");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{t.profile.loading}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Perfil no encontrado</p>
          <Button asChild className="mt-4">
            <a href="/">Volver al inicio</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-border bg-card p-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <h1 className="text-3xl font-bold">{t.profile.title}</h1>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
            </Button>
          </div>

          {/* Profile Content */}
          <div className="space-y-8">
            {/* Avatar Section */}
            {profile.avatar_url && (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-border">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || "Avatar"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="space-y-6">
              {/* Full Name */}
              <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="text-lg font-semibold">
                    {profile.full_name || "No configurado"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.profile.email}
                  </p>
                  <p className="text-lg font-semibold">{profile.email}</p>
                </div>
              </div>

              {/* Provider */}
              {profile.provider && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Proveedor de Autenticación
                  </p>
                  <p className="text-lg font-semibold capitalize">
                    {profile.provider === "google" && "🔵 Google"}
                    {profile.provider === "email" && "📧 Email/Password"}
                    {profile.provider === "linkedin" && "🔗 LinkedIn"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <a href="/">Volver al Inicio</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
