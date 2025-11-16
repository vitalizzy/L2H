# 📚 Sistema de Blog Dinámico con Markdown

Este es un sistema completo de blog que permite crear, editar y publicar artículos usando Markdown.

## 🚀 Características

- ✅ Artículos en Markdown
- ✅ Renderizado con `next-mdx-remote`
- ✅ Almacenamiento en Supabase
- ✅ SEO optimizado
- ✅ Soporte para múltiples autores
- ✅ Imágenes y embeds
- ✅ Totalmente responsive

## 📋 Estructura de datos

### Tabla `pages` en Supabase

```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,           -- URL amigable (ej: "getting-started")
  title TEXT NOT NULL,                 -- Título del artículo
  description TEXT NOT NULL,           -- Meta descripción
  content TEXT NOT NULL,               -- Contenido en Markdown
  author TEXT,                         -- Autor del artículo
  image_url TEXT,                      -- Imagen destacada (opcional)
  published BOOLEAN DEFAULT true,      -- Solo mostrar si está publicado
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

## 🔧 Instalación

### 1. Ejecutar el script SQL

En tu panel de Supabase:
1. Ve a "SQL Editor"
2. Crea una nueva query
3. Copia el contenido de `sql/pages_schema.sql`
4. Ejecuta la query

Esto creará:
- La tabla `pages`
- Políticas de seguridad (RLS)
- 3 artículos de ejemplo

### 2. Verificar las dependencias

```bash
npm list next-mdx-remote
```

Ya está instalado ✅

## 📝 Crear un nuevo artículo

### Opción A: Por SQL (Supabase)

```sql
INSERT INTO pages (slug, title, description, content, author, published) 
VALUES (
  'mi-primer-articulo',
  'Mi Primer Artículo',
  'Una descripción corta del artículo',
  '# Mi Primer Artículo

Este es el contenido en **Markdown**...',
  'Tu Nombre',
  true
);
```

### Opción B: Crear interfaz admin (futuro)

Puedes crear un panel admin para que usuarios autenticados creen artículos.

## 📖 Sintaxis Markdown soportada

```markdown
# Encabezado 1
## Encabezado 2
### Encabezado 3

**Bold**
*Italic*
~~Strikethrough~~

- Lista sin orden
- Punto 2

1. Lista ordenada
2. Punto 2

[Link](https://example.com)

> Blockquote

![Imagen](url)

\`\`\`javascript
// Código con sintaxis
console.log('Hola')
\`\`\`

| Tabla | Ejemplo |
|-------|---------|
| Fila 1 | Datos  |
```

## 🎨 Componentes renderizados

Los componentes están customizados con Tailwind CSS:

- `h1`, `h2`, `h3`, `h4` - Encabezados con estilos
- `p` - Párrafos con espaciado
- `ul`, `ol` - Listas con iconos
- `blockquote` - Comillas destacadas
- `code` - Código con fondo
- `a` - Enlaces en color primario
- `table` - Tablas responsivas
- `img` - Imágenes con rounded corners

## 🔗 Rutas disponibles

- `/blog` - Listado de todos los artículos
- `/blog/[slug]` - Artículo individual

## 🎯 Variables disponibles

Cada página tiene estas variables disponibles:

```typescript
interface BlogPage {
  id: string;                    // UUID único
  slug: string;                  // URL amigable
  title: string;                 // Título
  description: string;           // Meta descripción
  content: string;               // Contenido Markdown
  author?: string;               // Autor (opcional)
  image_url?: string;            // Imagen (opcional)
  published: boolean;            // Publicado o no
  created_at: string;            // Fecha de creación
  updated_at: string;            // Última actualización
}
```

## 🔐 Seguridad (RLS)

Las políticas de seguridad están configuradas así:

- ✅ **Lectura**: Cualquiera puede leer artículos publicados
- ✅ **Escritura**: Solo usuarios autenticados pueden crear
- ✅ **Edición**: Solo usuarios autenticados pueden editar

Para usuarios anónimos, solo ven artículos con `published = true`.

## 🚀 Deploy en Producción

El sistema está optimizado para producción:

- Static generation con `generateStaticParams()`
- ISR (Incremental Static Regeneration) automático
- SEO metadata dinámico
- Optimización de imágenes
- Caché inteligente

## 📊 Ejemplos de artículos incluidos

1. **Getting Started with Mini SaaS** - Guía de inicio
2. **10 Authentication Best Practices** - Seguridad
3. **Deploying to Production** - Deploy

## 🔄 Próximas mejoras

- [ ] Panel admin para crear artículos
- [ ] Búsqueda de artículos
- [ ] Tags y categorías
- [ ] Comentarios
- [ ] Sistema de recomendaciones
- [ ] Analytics de lectura

## 💡 Tips

1. Usa slugs descriptivos y en minúsculas
2. Escribe descriptions de 120-160 caracteres para SEO
3. Incluye imágenes para mejor engagement
4. Usa encabezados para mejor estructura
5. Actualiza la fecha `updated_at` cuando edites

## ❓ Preguntas frecuentes

**¿Puedo usar HTML en Markdown?**
Sí, `next-mdx-remote` soporta HTML.

**¿Qué pasa si cambio el slug?**
Las URLs antiguas se romperán. Usa redirects.

**¿Cómo puedo hacer draft de artículos?**
Usa `published = false` para guardar borradores.

**¿Puedo usar componentes React personalizados?**
Sí, con la config de `components` en MDXRemote.

---

¡Listo para escribir increíbles artículos! 📝✨
