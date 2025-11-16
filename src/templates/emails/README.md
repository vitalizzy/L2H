# Email Templates

Esta carpeta contiene templates HTML para los emails enviados a los usuarios de L2H.

## Estructura

```
src/templates/emails/
├── welcome.html              # Email de bienvenida
├── signup-confirmation.html  # Email de confirmación de signup
├── confirm-email.html        # Email de confirmación de cuenta
├── reset-password.html       # Email para reseteo de contraseña
├── password-changed.html     # Notificación de cambio de contraseña
└── README.md                 # Este archivo
```

## Plantillas Disponibles

### 1. welcome.html
**Uso:** Enviado cuando un usuario se registra exitosamente.

**Variables:**
- `{{userName}}` - Nombre del usuario
- `{{appUrl}}` - URL base de la aplicación

### 2. signup-confirmation.html
**Uso:** Enviado durante el proceso de signup para confirmar el email.

**Variables:**
- `{{email}}` - Email del usuario
- `{{confirmationUrl}}` - URL para confirmar el email
- `{{appUrl}}` - URL base de la aplicación

### 3. confirm-email.html
**Uso:** Enviado para que el usuario confirme su email.

**Variables:**
- `{{userName}}` - Nombre del usuario
- `{{confirmationUrl}}` - URL para confirmar el email
- `{{confirmationCode}}` - Código de confirmación
- `{{appUrl}}` - URL base de la aplicación

### 4. reset-password.html
**Uso:** Enviado cuando el usuario solicita resetear su contraseña.

**Variables:**
- `{{userName}}` - Nombre del usuario
- `{{resetUrl}}` - URL para resetear la contraseña
- `{{email}}` - Email del usuario
- `{{appUrl}}` - URL base de la aplicación

### 5. password-changed.html
**Uso:** Confirmación de que la contraseña fue cambiada exitosamente.

**Variables:**
- `{{userName}}` - Nombre del usuario
- `{{timestamp}}` - Fecha y hora del cambio
- `{{appUrl}}` - URL base de la aplicación

## Personalización

### Cambiar Estilos
Todos los templates usan estilos CSS inline. Para cambiar colores, fuentes o espaciado:

1. Abre el template HTML
2. Modifica la sección `<style>`
3. Prueba en un cliente de email o previewizador

### Agregar Nuevos Templates

Para agregar un nuevo template:

1. Crea un nuevo archivo `.html` en esta carpeta
2. Sigue la estructura base de los templates existentes
3. Incluye las variables necesarias entre `{{}}`
4. Documente en este README

## Recomendaciones

- ✅ Mantén los emails simples y legibles
- ✅ Usa colores consistentes con la marca
- ✅ Incluye siempre un call-to-action claro
- ✅ Prueba los emails en múltiples clientes (Gmail, Outlook, Apple Mail, etc.)
- ✅ Asegúrate de que los enlaces sean accesibles
- ✅ Incluye información de contacto/soporte

## Integración

Para integrar estos templates en tu aplicación:

```typescript
import fs from 'fs';
import path from 'path';

function loadEmailTemplate(templateName: string, variables: Record<string, string>) {
  const templatePath = path.join(process.cwd(), 'src/templates/emails', `${templateName}.html`);
  let html = fs.readFileSync(templatePath, 'utf-8');
  
  // Reemplazar variables
  Object.entries(variables).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  return html;
}

// Uso
const html = loadEmailTemplate('welcome', {
  userName: 'John Doe',
  appUrl: 'https://l2h.com'
});
```

## Mejores Prácticas

1. **Testing**: Prueba siempre los templates antes de enviarlos
2. **Móvil**: Asegúrate de que se vean bien en dispositivos móviles
3. **Alt Text**: Incluye alt text en las imágenes
4. **Accessibilidad**: Usa contraste de colores adecuado
5. **Seguridad**: Nunca incluyas información sensible en plain text

## Soporte

Para problemas o sugerencias sobre los templates de email, abre un issue en el repositorio.
