-- Create pages table for blog/dynamic content
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add RLS policies
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published pages
CREATE POLICY "Anyone can read published pages"
  ON pages
  FOR SELECT
  USING (published = true);

-- Only authenticated users can create pages (optional, for future admin panel)
CREATE POLICY "Authenticated users can create pages"
  ON pages
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update their own pages
CREATE POLICY "Authenticated users can update pages"
  ON pages
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Sample data for testing
INSERT INTO pages (slug, title, description, content, author, published) VALUES
(
  'getting-started-with-mini-saas',
  'Guía: Comenzar con Mini SaaS Starter Kit',
  'Aprende cómo configurar tu primer Mini SaaS en 5 minutos',
  '# Guía: Comenzar con Mini SaaS Starter Kit

Mini SaaS Starter Kit es un template listo para producción que te permite crear aplicaciones SaaS modernas rápidamente.

## ¿Qué es Mini SaaS Starter Kit?

Es una aplicación Next.js 16 completa con:

- ✅ Autenticación con Supabase
- ✅ Base de datos PostgreSQL
- ✅ Soporte para 11 idiomas
- ✅ Diseño responsive con Tailwind CSS
- ✅ Sistema de temas (Light/Dark/System)
- ✅ Email templates profesionales
- ✅ Gestión de usuarios integrada

## Paso 1: Instalación

Clona el repositorio:

```bash
git clone https://github.com/vitalizzy/L2H.git
cd L2H
npm install
```

## Paso 2: Configurar Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia tus credenciales en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
```

## Paso 3: Iniciar desarrollo

```bash
npm run dev
```

¡Listo! Tu aplicación está corriendo en `http://localhost:3000`

## Próximos pasos

- Personaliza los colores en `tailwind.config.ts`
- Añade tus propias páginas
- Configura tu dominio personalizado
- Despliega a producción

¡Feliz codificación!',
  'L2H Team',
  true
),
(
  'authentication-best-practices',
  '10 Mejores prácticas de autenticación',
  'Cómo implementar autenticación segura en tus aplicaciones',
  '# 10 Mejores prácticas de autenticación

La autenticación es crítica para la seguridad de tu aplicación. Aquí te mostramos 10 prácticas esenciales.

## 1. Usa HTTPS siempre

Nunca transmitas contraseñas o tokens sobre HTTP sin encriptar.

## 2. Implementa 2FA

La autenticación de dos factores añade una capa extra de seguridad.

```typescript
// Validar código 2FA
const { data, error } = await supabase.auth.verifyOtp({
  email: user.email,
  token: code,
  type: ''
})
```

## 3. Hashea las contraseñas

Nunca almacenes contraseñas en texto plano. Usa algoritmos como bcrypt.

## 4. Implementa rate limiting

Protege tus endpoints de ataques de fuerza bruta.

## 5. Usa tokens JWT seguros

Los tokens JWT deben:
- Ser de corta duración (15-30 minutos)
- Tener un refresh token de larga duración
- Ser almacenados de forma segura

## 6. Implementa CSRF protection

Protege contra ataques CSRF usando tokens CSRF.

## 7. Registra intentos de login fallidos

Mantén un log de intentos sospechosos.

## 8. Implementa password reset seguro

- Envía links por email
- Los links deben expirar en 1 hora
- Invalida sesiones anteriores

## 9. Usa contexto de autenticación

Evita prop drilling con Context API.

## 10. Audita regularmente

Revisa tus logs de seguridad regularmente.

---

## Resumen

La seguridad en autenticación no es un lujo, es una necesidad. Implementa estas prácticas desde el inicio de tu proyecto.',
  'Security Team',
  true
),
(
  'deploying-to-production',
  'Desplegando tu Mini SaaS a producción',
  'Guía completa para desplegar tu aplicación en Vercel, Netlify o tu servidor',
  '# Desplegando tu Mini SaaS a producción

Una vez que tu aplicación está lista, es hora de llevarla a producción. Aquí te mostramos cómo.

## Opción 1: Vercel (Recomendado para Next.js)

Vercel es creada por el mismo equipo que Next.js, así que la integración es perfecta.

### Pasos:

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Añade tus variables de entorno
5. ¡Listo!

```bash
# Tu app estará disponible en tu-dominio.vercel.app
```

## Opción 2: Netlify

Alternativa excelente a Vercel.

### Pasos:

1. Conecta tu repositorio GitHub
2. Configura el build command: `npm run build`
3. Configura el directorio de salida: `.next`
4. Añade variables de entorno
5. ¡Despliegue!

## Opción 3: Railway

Para más control sobre la infraestructura.

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## Checklist pre-producción

- ✅ Variables de entorno configuradas
- ✅ Base de datos respaldada
- ✅ SSL certificado configurado
- ✅ Monitoreo configurado
- ✅ Backups automáticos habilitados
- ✅ Analytics integrado
- ✅ Error tracking (Sentry)

## Monitoreo en producción

Usa herramientas como:
- **Sentry**: Tracking de errores
- **LogRocket**: User session recording
- **Datadog**: Monitoreo de infraestructura

¡Tu aplicación está en producción! 🚀',
  'DevOps Team',
  true
);

-- Optional: Create an index for better query performance
CREATE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug);
CREATE INDEX IF NOT EXISTS pages_published_idx ON pages(published);
