# 🐛 Debug: Errores de Autenticación Supabase

## Errores Identificados

### 1. ❌ Error 400 en `auth/v1/token`
```
Failed to load resource: the server responded with a status of 400
```

**Causas posibles:**
- Email/contraseña inválidos
- Cuenta no existe
- Formato de credenciales incorrecto

**Solución:** Verificar credenciales en login

---

### 2. ❌ Error 500 en `auth/v1/signup`
```
Failed to load resource: the server responded with a status of 500
```

**Causas más probables:**
- **Falta configurar Postgres Trigger** en Supabase para crear perfil automáticamente
- Usuario ya existe
- Problema con variables de entorno
- Falta de permisos RLS

**Solución:** 

#### A. Ejecutar Script SQL en Supabase:

1. Ve a **Supabase Dashboard → SQL Editor**
2. Crea una nueva query y ejecuta esto:

\`\`\`sql
-- Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuario puede ver su propio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Política: Usuario puede actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Crear función para auto-crear perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, provider)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'provider'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
\`\`\`

#### B. Verificar Configuración de Email:

En **Supabase Dashboard → Authentication → Email Templates:**
- Verificar que el template de confirmación esté activo
- Si no te llegan emails, verificar carpeta spam

#### C. Verificar Variables de Entorno:

En `.env.local`:
\`\`\`dotenv
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://cmxtjcarkpjvjjtceiom.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

✅ Todas deben estar presentes

---

### 3. ⚠️ Warning: `scroll-behavior: smooth`
```
Detected `scroll-behavior: smooth` on the <html> element
```

**Solución:** En `src/app/layout.tsx`:

\`\`\`tsx
<html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
  {/* contenido */}
</html>
\`\`\`

---

## 🧪 Pasos para Debugear

### 1. Revisar Console del Navegador
- Abre DevTools (F12)
- Ve a **Network tab**
- Intenta hacer login
- Busca la request a `auth/v1/token`
- Haz click y mira la respuesta completa

### 2. Revisar Respuesta del Servidor
Añade logs en `login-form.tsx`:

\`\`\`typescript
async function handleLogin(values: LoginValuesType) {
  console.log("🔍 Intento de login:", values.email);
  
  const { data, error } = await supabase.auth.signInWithPassword(values);
  
  console.log("📤 Respuesta Supabase:", { data, error });
  
  if (error) {
    console.error("❌ Error:", error.message, error.status);
    return toast.error(error.message);
  }

  console.log("✅ Login exitoso");
  toast.success(t.login.loginSuccess);
  router.refresh();
}
\`\`\`

### 3. Revisar Logs de Supabase
En **Supabase Dashboard → Auth → User Management:**
- Verifica si el usuario se creó
- Mira el estado de confirmación de email

---

## 🔧 Soluciones Rápidas

### Si el error es 400 (Bad Request):
```bash
# Verifica credenciales:
# - Email: correo@example.com
# - Contraseña: mínimo 8 caracteres
```

### Si el error es 500 (Server Error):
```bash
# 1. Ejecuta el SQL script anterior
# 2. Verifica que el trigger se creó:
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

# 3. Verifica permisos RLS:
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Si los emails no llegan:
- Ir a **Auth → Email Templates**
- Habilitar "Confirm signup"
- Cambiar "From email" a un email real
- Verificar carpeta spam

---

## 📋 Checklist de Configuración

- [ ] Trigger SQL ejecutado
- [ ] RLS habilitado en tabla profiles
- [ ] Políticas RLS creadas
- [ ] Variables de entorno configuradas
- [ ] Email confirmación habilitado en Supabase
- [ ] `data-scroll-behavior="smooth"` en html tag

---

## 🚀 Comandos útiles para resetear

Si todo falla, puedes resetear desde Supabase Dashboard:

1. **Borrar usuarios:**
   - Auth → User Management
   - Seleccionar usuario → Delete

2. **Resetear tabla profiles:**
   \`\`\`sql
   TRUNCATE TABLE public.profiles CASCADE;
   \`\`\`

3. **Recrear trigger:**
   \`\`\`sql
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   \`\`\`

---

## 📞 Si aún hay problemas:

1. Comparte respuesta completa del error (F12 → Network)
2. Verifica que Supabase no está en modo de mantenimiento
3. Intenta con otro navegador/incógnito
4. Resetea credenciales de Supabase

