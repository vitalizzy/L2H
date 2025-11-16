# MarkdownToHtml - Guía de Uso

Clase TypeScript reutilizable que convierte Markdown a HTML con soporte completo para enlaces, imágenes y más.

## 📦 Instalación

La clase ya está ubicada en `src/utils/markdown-to-html.ts`

## 🚀 Uso Básico

### En TypeScript/JavaScript

```typescript
import { markdownToHtml, MarkdownToHtml } from "@/utils/markdown-to-html";

// Forma simplificada
const html = markdownToHtml("# Hola **Mundo**");

// Forma completa con opciones
const converter = new MarkdownToHtml({
  targetBlank: true,   // Abre enlaces en nueva pestaña
  sanitize: true,      // Elimina scripts y atributos peligrosos
});
const html = converter.convert("# Título");
```

### En Componentes React

```tsx
import { MarkdownDisplay } from "@/components/markdown-display";

export function MyPage() {
  const markdown = `
# Bienvenido

Este es un **párrafo** con _énfasis_.

- Lista item 1
- Lista item 2

[Enlace a Google](https://google.com)
![Alt text](https://example.com/image.jpg)
  `;

  return (
    <MarkdownDisplay 
      content={markdown}
      targetBlank={true}
      sanitize={true}
    />
  );
}
```

## 📝 Sintaxis Soportada

### Títulos
```markdown
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

### Formato de Texto
```markdown
**negrita** o __negrita__
*cursiva* o _cursiva_
***negrita y cursiva***
~~tachado~~
`código inline`
```

### Enlaces
```markdown
# HTTP/HTTPS
[Texto del enlace](https://example.com)

# Mailto
[Enviar email](mailto:email@example.com)

# Teléfono
[Llamar](tel:+34612345678)

# Enlace relativo
[Página local](/ruta/local)
```

### Imágenes
```markdown
![Texto alternativo](https://example.com/image.jpg)
![Con título](https://example.com/image.jpg "Título de la imagen")
```

### Listas

#### Sin Orden
```markdown
- Item 1
- Item 2
  - Sub-item
- Item 3

O también con * o +
```

#### Ordenadas
```markdown
1. Primer item
2. Segundo item
3. Tercer item
```

### Tablas
```markdown
| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Dato 1    | Dato 2    | Dato 3    |
| Dato 4    | Dato 5    | Dato 6    |
```

### Citas
```markdown
> Esta es una cita
> Puede tener múltiples líneas
> Y se renderiza como blockquote
```

### Bloques de Código
````markdown
```typescript
function hello() {
  console.log("Hola");
}
```

```python
def hello():
    print("Hola")
```
````

### Líneas Horizontales
```markdown
---
***
___
```

## 🔒 Seguridad

### Sanitización
La clase puede sanitizar HTML para evitar XSS:

```typescript
const converter = new MarkdownToHtml({ sanitize: true });
const html = converter.getSafeHtml(userInput);
```

Elimina:
- Tags de script
- Event handlers (onclick, onload, etc.)
- Atributos peligrosos

## 🎯 Opciones

```typescript
interface MarkdownOptions {
  sanitize?: boolean;      // Default: true
  targetBlank?: boolean;   // Default: true
}
```

### `sanitize`
- `true`: Elimina scripts y atributos peligrosos
- `false`: Convierte sin sanitizar (usar solo con contenido confiable)

### `targetBlank`
- `true`: Enlaces HTTP abren en nueva pestaña (`target="_blank"`)
- `false`: Enlaces se abren en la misma pestaña

## 📚 Ejemplos Completos

### Ejemplo 1: Blog Post

```typescript
const markdown = `
# Mi Primer Blog Post

Escrito por [Mi Nombre](https://example.com)

## Introducción

Este es un **artículo importante** con _contenido relevante_.

### Sección 1

- Punto 1
- Punto 2
- Punto 3

### Sección 2

\`\`\`typescript
const mensaje = "Hola, mundo";
console.log(mensaje);
\`\`\`

> La programación es el arte de resolver problemas

[Leer más](https://example.com/articulo)
`;

import { markdownToHtml } from "@/utils/markdown-to-html";
const html = markdownToHtml(markdown);
```

### Ejemplo 2: Soporte de Usuario

```tsx
import { MarkdownDisplay } from "@/components/markdown-display";

export function SupportPage() {
  const content = `
# Centro de Soporte

## Contactos Importantes

| Servicio | Teléfono | Email |
|----------|----------|-------|
| Soporte | [+34 123 456 789](tel:+34123456789) | [support@example.com](mailto:support@example.com) |
| Ventas | [+34 987 654 321](tel:+34987654321) | [ventas@example.com](mailto:ventas@example.com) |

## Preguntas Frecuentes

> **P: ¿Cómo contactar soporte?**
> 
> R: Puedes llamar o enviar email usando los contactos arriba.

![Mapa de ubicación](https://example.com/mapa.jpg)
  `;

  return <MarkdownDisplay content={content} />;
}
```

### Ejemplo 3: Notas con Imágenes

```typescript
const notes = `
# Documentación del Proyecto

![Logo del proyecto](https://example.com/logo.png "Nuestro Logo")

## Características

1. **Markdown completo** - Soporte para toda la sintaxis
2. **Seguro** - Sanitización contra XSS
3. **Flexible** - Múltiples opciones de configuración

---

\`\`\`bash
npm install markdown-parser
\`\`\`

Para más info: [Documentación oficial](https://docs.example.com)
`;
```

## 🎨 Estilos CSS

El componente React usa Tailwind CSS. Puedes personalizar el estilo:

```tsx
<MarkdownDisplay 
  content={markdown}
  className="prose prose-lg dark:prose-invert max-w-2xl mx-auto"
/>
```

Las clases Tailwind `prose` dan estilos por defecto a:
- Títulos con tamaños adecuados
- Párrafos con espaciado correcto
- Enlaces con colores
- Código con fondo
- Tablas formateadas
- etc.

## 🔧 Métodos Disponibles

```typescript
class MarkdownToHtml {
  // Convierte markdown a HTML
  convert(markdown: string): string

  // Convierte y sanitiza
  getSafeHtml(markdown: string): string
}

// Función utilitaria
markdownToHtml(markdown: string, options?: MarkdownOptions): string
```

## ⚠️ Limitaciones

- No soporta Markdown extendido (GFM) avanzado
- Las tablas son básicas (sin alineación)
- No soporta custom HTML
- No soporta footnotes

## 🚀 Performance

- Usa `useMemo` en React para evitar re-renders innecesarios
- Conversión rápida incluso con documentos grandes
- HTML sanitizado solo si es necesario

## 📝 Licencia

Libre de usar en el proyecto L2H
