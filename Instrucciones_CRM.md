# Guía de Configuración del CRM (Google Sheets + Apps Script)

## Paso 1: Configurar el Google Sheet
1. Ve a tu Google Drive y crea un nuevo Google Sheet.
2. Renombra la primera pestaña de abajo a **Respuestas CRM**.
3. En la primera fila (Fila 1), escribe los siguientes encabezados de columna **exactamente en este orden** (A hasta la M):
   - A: Fecha
   - B: Nombre completo
   - C: País
   - D: Email
   - E: Teléfono
   - F: Volumen de inversión
   - G: Mercado de interés
   - H: Objetivo principal
   - I: ¿Ha invertido fuera?
   - J: Qué busca en un asesor
   - K: Score
   - L: Estado
   - M: Notas

## Paso 2: Configurar Google Apps Script
1. En el menú superior de tu Google Sheet, ve a **Extensiones > Apps Script**.
2. Se abrirá una nueva pestaña. Borra cualquier código que haya allí y **pega todo el contenido del archivo `codigo_apps_script.js`** (que ya se encuentra en la carpeta de tu proyecto).
3. **Paso Clave:** En la línea 60 del código que pegaste, verás esto:
   `const firmaUrl = "https://tudominio.com/Emilio 4k.jpeg";`
   Debes cambiar esa URL por la ruta real donde está alojada la imagen en internet (por ejemplo, la URL que te da Netlify para la imagen `Emilio 4k.jpeg`).
4. Haz clic en el icono del disquete para **Guardar** el script.

## Paso 3: Desplegar el Script para conectarlo con la web
1. En la esquina superior derecha, haz clic en el botón azul **Implementar** y luego en **Nueva implementación**.
2. Haz clic en el ícono del engranaje (Seleccionar tipo) y elige **Aplicación web**.
3. Completa así:
   - **Descripción:** CRM SGI
   - **Ejecutar como:** Yo (tu correo)
   - **Quién tiene acceso:** Cualquier persona *(¡Muy importante!)*
4. Haz clic en **Implementar**. 
   *(Ojo: Te pedirá que autorices permisos a tu propia cuenta. Google mostrará una advertencia de seguridad, haz clic en "Configuración avanzada" y luego en "Ir al proyecto (no seguro)" para permitir que el script envíe correos y edite la hoja).*
5. Al finalizar, Google te dará una **URL de la aplicación web**. Cópiala.

## Paso 4: Conectar la Web
1. Entrégame por este chat esa **URL de aplicación web** que acabas de copiar.
2. Yo la añadiré al archivo `agendar-llamada.html` y el sistema quedará 100% conectado.
