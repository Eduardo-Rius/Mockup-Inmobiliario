const SHEET_NAME = "Respuestas CRM"; // Cambia esto si tu hoja tiene otro nombre

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error("No se encontró la pestaña llamada " + SHEET_NAME);
    }
    
    // Extraer datos del POST (enviados via FormData desde HTML)
    const formData = e.parameter;
    const fecha = new Date();
    const nombre = formData.nombre || "";
    const pais = formData.pais || "";
    const email = formData.email || "";
    const telefono = formData.telefono || "";
    // Agregamos un apóstrofe al inicio para que Google Sheets lo tome como texto literal
    // y no crea que "+10M" es una fórmula matemática que deba resolver.
    const volumen = formData.volumen ? "'" + formData.volumen : "";
    const mercado = formData.mercado || "";
    const objetivo = formData.objetivo || "";
    const invertido_fuera = formData.invertido_fuera || "";
    const asesor = formData.asesor || "";
    const estado = "Nuevo Lead";
    const notas = "";
    
    // Obtener la última fila con datos para calcular en qué fila insertaremos
    const lastRow = sheet.getLastRow();
    const newRowIndex = lastRow + 1;
    
    // Eliminamos el apóstrofe para que la lógica de JS funcione correctamente
    const volumenLimpio = formData.volumen || "";
    let scoreNumerico = 1;
    if (volumenLimpio === "+10M") {
      scoreNumerico = 5;
    } else if (volumenLimpio === "3M–10M") {
      scoreNumerico = 4;
    } else if (volumenLimpio === "1M–3M") {
      scoreNumerico = 3;
    }

    // Array con el orden de las columnas:
    // 1:Fecha, 2:Nombre completo, 3:País, 4:Email, 5:Teléfono, 6:Volumen de inversión,
    // 7:Mercado de interés, 8:Objetivo principal, 9:¿Ha invertido fuera?, 10:Qué busca en un asesor,
    // 11:Score, 12:Estado, 13:Notas
    const rowData = [
      fecha, 
      nombre, 
      pais, 
      email, 
      telefono, 
      volumen, 
      mercado, 
      objetivo, 
      invertido_fuera, 
      asesor, 
      scoreNumerico, // Score calculado en el backend
      estado, 
      notas
    ];
    
    // Insertar datos en la hoja
    sheet.appendRow(rowData);
    
    // ----------- ENVÍO DEL EMAIL AUTOMÁTICO -----------
    
    // El ID de tu imagen en Google Drive
    const imageId = "14yyERpf6hLvRZFyOU_zmu2THBdQLTLGJ";
    const imageUrl = "https://drive.google.com/uc?export=download&id=" + imageId;
    let firmaBlob = null;
    
    try {
      // Descargamos la imagen como Blob usando UrlFetchApp en lugar de DriveApp
      // Esto evita bloqueos de permisos de Google Drive
      firmaBlob = UrlFetchApp.fetch(imageUrl).getBlob().setName("FirmaEmilio.jpeg");
    } catch (e) {
      console.log("Error al obtener la imagen: " + e.message);
    }
    
    const emailSubject = "Hemos recibido tu solicitud";
    
    // Usamos 'cid:firmaLogo' para inyectar la imagen directamente en el cuerpo del correo.
    // Así evitamos bloqueos de Outlook o firewalls corporativos.
    let imgTag = firmaBlob ? '<img src="cid:firmaLogo" alt="Firma Emilio" style="max-width: 200px; height: auto;" />' : '';
    
    const emailHtmlBody = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
        <p>Hemos recibido tu información correctamente.</p>
        <p>En SGI analizamos cada perfil de forma individual para confirmar si existe alineación con el tipo de operaciones que gestionamos.</p>
        <p>Si encaja con nuestro enfoque, recibirás una respuesta personal en un plazo máximo de 48 horas.</p>
        <p>Un saludo,</p>
        <br>
        ${imgTag}
      </div>
    `;

    // Enviar correo a quien rellenó el formulario
    if (email) {
      if (firmaBlob) {
        GmailApp.sendEmail(email, emailSubject, "", {
          htmlBody: emailHtmlBody,
          inlineImages: {
            firmaLogo: firmaBlob
          }
        });
      } else {
        GmailApp.sendEmail(email, emailSubject, "", {
          htmlBody: emailHtmlBody
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "error": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función requerida para manejar los CORS en peticiones web
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
