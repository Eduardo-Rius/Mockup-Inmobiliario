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
    const volumen = formData.volumen || "";
    const mercado = formData.mercado || "";
    const objetivo = formData.objetivo || "";
    const invertido_fuera = formData.invertido_fuera || "";
    const asesor = formData.asesor || "";
    const estado = "Nuevo Lead";
    const notas = "";
    
    // Obtener la última fila con datos para calcular en qué fila insertaremos
    const lastRow = sheet.getLastRow();
    const newRowIndex = lastRow + 1;
    
    // La fórmula de Score basada en el volumen de la columna F (F2, F3, etc.)
    // Asumiendo que Volumen es la columna F (la 6ta columna)
    const formulaScore = `=IF(F${newRowIndex}="+10M",5, IF(F${newRowIndex}="3M–10M",4, IF(F${newRowIndex}="1M–3M",3,1)))`;

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
      formulaScore, // El score dinámico
      estado, 
      notas
    ];
    
    // Insertar datos en la hoja
    sheet.appendRow(rowData);
    
    // ----------- ENVÍO DEL EMAIL AUTOMÁTICO -----------
    
    // URL de la firma (la imagen alojada en tu Netlify/GitHub)
    // REEMPLAZA ESTA URL por la ruta real de tu web (ej. https://tudominio.com/Emilio.jpeg)
    const firmaUrl = "https://tudominio.com/Emilio.jpeg";
    
    const emailSubject = "Hemos recibido tu solicitud";
    
    const emailHtmlBody = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
        <p>Hemos recibido tu información correctamente.</p>
        <p>En SGI analizamos cada perfil de forma individual para confirmar si existe alineación con el tipo de operaciones que gestionamos.</p>
        <p>Si encaja con nuestro enfoque, recibirás una respuesta personal en un plazo máximo de 48 horas.</p>
        <p>Un saludo,</p>
        <br>
        <img src="${firmaUrl}" alt="Firma Emilio" style="max-width: 200px; height: auto;" />
      </div>
    `;

    // Enviar correo a quien rellenó el formulario
    if (email) {
      GmailApp.sendEmail(email, emailSubject, "", {
        htmlBody: emailHtmlBody
      });
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
