# 🔐 Checklist: Configuración Completa de Auth (Login, Register, Forgot Password)

## ✅ PASO 1: Configuración en SUPABASE

### 1.1 Ejecutar SQL Setup (si no lo hiciste)
**Archivo:** `SUPABASE_SETUP.sql`
- [ ] Ejecutar en Supabase SQL Editor
- Crea tabla `profiles` con trigger automático
- Configura RLS policies

```sql
-- Verificar que la tabla existe:
SELECT * FROM public.profiles LIMIT 1;
```

### 1.2 Configurar Autenticación en Supabase Console

**URL:** https://app.supabase.com → Proyecto → Authentication

#### Email/Password:
- [ ] Enable: "Email" provider
- [ ] Verificar: "Confirm email" está habilitado
- [ ] Verificar: "Double confirm changes" está habilitado
- [ ] Templates: Email confirmation template personalizada (opcional)

#### Google OAuth:
- ⚠️ **REMOVED** - OAuth is no longer supported. Use Email/Password authentication only.

### 1.3 Configurar Email en Supabase
**URL:** https://app.supabase.com → Proyecto → Email

- [ ] SMTP configurado O Supabase email enabled
- [ ] From address configurada
- [ ] Templates de email configuradas

### 1.4 Configurar URLs autorizadas
**URL:** https://app.supabase.com → Proyecto → Authentication → URL Configuration

```
Site URL: https://higueronlomas2.com (o tu dominio)
Redirect URLs:
- http://localhost:3000/auth/callback
- https://higueronlomas2.com/auth/callback
```

---

## ✅ PASO 2: Configuración en .env.local

**Archivo:** `.env.local`

```env
# URLs
NEXT_PUBLIC_BASE_URL=https://higueronlomas2.com (Cambiar en producción)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Tu ANON KEY]

# IMPORTANTE: Para forgot-password con admin
SUPABASE_SERVICE_ROLE_KEY=[Tu SERVICE_ROLE_KEY]
```

---

## ✅ PASO 3: Código a Modificar

### 3.1 Login (`src/app/(auth)/login/_components/login-form.tsx`)

**Estado:** ✅ Funcionando
**Cambios necesarios:**
- [ ] Verificar que `handleLogin` llamea `supabase.auth.signInWithPassword()`
- [ ] Verificar error handling

```typescript
// Correcto:
const { error } = await supabase.auth.signInWithPassword({
  email: values.email,
  password: values.password,
});
```

### 3.2 Register (`src/app/(auth)/register/_components/register-form.tsx`)

**Estado:** ⚠️ Necesita ajustes
**Cambios necesarios:**
- [ ] Asegurar que `emailRedirectTo` apunta a `/auth/callback?type=signup`
- [ ] Verificar que tipo de query param se envía

```typescript
// ✅ Correcto:
const { error } = await supabase.auth.signUp({
  email: data.email,
  password: data.password,
  options: {
    emailRedirectTo: `${location.origin}/auth/callback?type=signup`,
  },
});
```

### 3.3 Forgot Password (`src/app/(auth)/forgot-password/page.tsx`)

**Estado:** ⚠️ Necesita ajustes
**Cambios necesarios:**
- [ ] Usar `supabase.auth.resetPasswordForEmail()`
- [ ] Manejo correcto de errores
- [ ] Validar que URL de reset es correcta

```typescript
// ✅ Correcto:
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${location.origin}/auth/callback?type=recovery`,
});
```

### 3.4 Callback Route (`src/app/api/auth/callback/route.ts`)

**Estado:** ⚠️ Crítico - Necesita revisión
**Cambios necesarios:**
- [ ] Manejar `type=signup` → redirigir a `/onboarding`
- [ ] Manejar `type=recovery` → redirigir a `/reset-password`
- [ ] Manejar OAuth code exchange correctamente
- [ ] Validar token_hash para magic links

```typescript
// Casos a manejar:
// 1. ?type=signup - Email verification para nuevos registros
// 2. ?type=recovery - Password reset link
// 3. ?code=... - OAuth2 callback
```

---

## ✅ PASO 4: Páginas Frontend Necesarias

Verifica que existen estos archivos:

- [ ] `/src/app/(auth)/login/page.tsx` - ✅ Existe
- [ ] `/src/app/(auth)/login/_components/login-form.tsx` - ✅ Existe
- [ ] `/src/app/(auth)/register/page.tsx` - ✅ Existe
- [ ] `/src/app/(auth)/register/_components/register-form.tsx` - ✅ Existe
- [ ] `/src/app/(auth)/forgot-password/page.tsx` - ✅ Existe
- [ ] `/src/app/(auth)/confirm-signup/page.tsx` - ✅ Existe
- [ ] `/src/app/(main)/onboarding/page.tsx` - ✅ Existe
- [ ] `/src/app/api/auth/callback/route.ts` - ⚠️ Revisar

---

## ✅ PASO 5: Crear Página de Reset Password

**Falta crear:** `/src/app/(auth)/reset-password/page.tsx`

```typescript
"use client";

import { useSearchParams, useRouter } from "next/navigation";
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

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Min 8 characters"),
});

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    // Verificar que hay token válido
    const hash = window.location.hash;
    if (!hash.includes("access_token")) {
      toast.error("Invalid reset link");
      router.push("/login");
    }
  }, [router]);

  async function handleResetPassword(data: { password: string }) {
    setIsLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      router.push("/login");
    }
    
    setIsLoading(false);
  }

  return (
    <section className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-80">
        <h1>Reset Password</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleResetPassword)}>
            <InputForm
              type="password"
              label="New Password"
              name="password"
              required
            />
            <Button disabled={isLoading} className="w-full">
              Update Password
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
```

---

## ✅ PASO 6: Verificaciones de Flujo

### Login Flow:
```
Usuario escribe email/password → click Login
→ supabase.auth.signInWithPassword()
→ Si OK: redirect a home
→ Si error: mostrar toast con error
```

### Register Flow:
```
Usuario completa form → click Register
→ supabase.auth.signUp() con emailRedirectTo
→ Email enviado a usuario
→ Usuario click en link → /auth/callback?type=signup
→ Redirige a /onboarding
→ Usuario completa profile
→ Redirige a home
```

### Forgot Password Flow:
```
Usuario entra a /forgot-password
→ Escribe email
→ supabase.auth.resetPasswordForEmail()
→ Email sent confirmation
→ Usuario click en link → /auth/callback?type=recovery
→ Redirige a /reset-password
→ Usuario escribe nueva password
→ supabase.auth.updateUser({ password: ... })
→ Redirige a /login
```

---

## ✅ PASO 7: Testing

### Test Email/Password Login:
- [ ] Registrarse con email/password
- [ ] Verificar que llega email de confirmación
- [ ] Click en link de confirmación
- [ ] Redirecciona a onboarding
- [ ] Completar onboarding
- [ ] Aparece en home autenticado
- [ ] Logout funciona
- [ ] Login con credenciales funciona

### Test Forgot Password:
- [ ] Click "Forgot Password" en login
- [ ] Escribir email
- [ ] Verificar que llega email
- [ ] Click en link
- [ ] Escribir nueva password
- [ ] Logout y login con nueva password

---

## 🚨 PROBLEMAS COMUNES

### Error 400 en /token:
- **Causa:** Credenciales incorrectas o usuario no verificado
- **Solución:** Verificar email confirmación, luego login

### Error 500 en /signup:
- **Causa:** Email ya existe o config de Supabase incompleta
- **Solución:** Verificar SMTP, email templates, quotas

### Magic link no llega:
- **Causa:** Email no configurado en Supabase
- **Solución:** Configurar SMTP o usar Supabase emails

### OAuth redirige a /register pero email no se pre-llena:
- **Causa:** URL callback incorrecta
- **Solución:** Verificar `NEXT_PUBLIC_BASE_URL` en .env.local

---

## 📋 Resumen de Archivos a Revisar

```
✅ = Está bien
⚠️ = Revisar/Ajustar
❌ = Falta crear

Código:
✅ src/app/(auth)/login/page.tsx
✅ src/app/(auth)/login/_components/login-form.tsx
✅ src/app/(auth)/register/page.tsx
✅ src/app/(auth)/register/_components/register-form.tsx
✅ src/app/(auth)/forgot-password/page.tsx
✅ src/app/(auth)/confirm-signup/page.tsx
✅ src/app/(main)/onboarding/page.tsx
⚠️ src/app/api/auth/callback/route.ts (CRÍTICO)
❌ src/app/(auth)/reset-password/page.tsx (CREAR)

Supabase:
⚠️ SUPABASE_SETUP.sql (Ejecutar si no está hecho)
⚠️ Email templates (Verificar)
⚠️ Auth providers (Google OAuth)
⚠️ URL Configuration

Env:
⚠️ .env.local (Verificar todas las keys)
```

---

## 🎯 Próximos Pasos

1. **Verificar SUPABASE_SETUP.sql ejecutado**
2. **Revisar callback/route.ts** - Es el archivo más crítico
3. **Crear reset-password/page.tsx** si no existe
4. **Probar cada flow** con logs en console
5. **Verificar emails llegan**
6. **Test completo end-to-end**
