const SHEET_NAME = "Respuestas CRM"; // Nombre de la pestaña en tu Google Sheet

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error("No se encontró la pestaña llamada " + SHEET_NAME);
    }
    
    // Extraer datos del POST (enviados via FormData desde el formulario HTML)
    const formData = e.parameter;
    const fecha = new Date();
    const nombre = formData.nombre || "";
    const empresa = formData.empresa || "";
    const cargo = formData.cargo || "";
    const pais = formData.pais || "";
    const email = formData.email || "";
    const telefono = formData.telefono || "";
    const objetivo = formData.objetivo || "";
    const descripcion = formData.descripcion || "";
    const alcance = formData.alcance || "";
    // Agregamos un apóstrofe al inicio para que Google Sheets lo tome como texto literal
    const volumen = formData.volumen ? "'" + formData.volumen : "";
    const horizonte = formData.horizonte || "";
    const motivo_hablar = formData.motivo_hablar || "";
    
    // Calcular Score basado en el Volumen de Oportunidad
    const volumenLimpio = formData.volumen || "";
    let scoreNumerico = 1;
    if (volumenLimpio === "Más de 10 millones €") {
      scoreNumerico = 5;
    } else if (volumenLimpio === "Entre 1 y 10 millones €") {
      scoreNumerico = 4;
    } else if (volumenLimpio === "Menos de 1 millón €") {
      scoreNumerico = 2;
    } else if (volumenLimpio === "Prefiero comentarlo personalmente") {
      scoreNumerico = 3;
    }
    
    // Array con el orden de las columnas:
    // 1:Fecha, 2:Nombre completo, 3:Empresa, 4:Cargo, 5:País, 6:Email, 7:WhatsApp,
    // 8:Objetivos, 9:Situación, 10:Alcance, 11:Volumen, 12:Horizonte, 13:Motivo de Solicitud, 14:Score
    const rowData = [
      fecha, 
      nombre, 
      empresa,
      cargo,
      pais, 
      email, 
      telefono, 
      objetivo, 
      descripcion,
      alcance,
      volumen, 
      horizonte,
      motivo_hablar,
      scoreNumerico
    ];
    
    // Insertar datos en la hoja
    sheet.appendRow(rowData);
    
    // ----------- ENVÍO DEL EMAIL AUTOMÁTICO -----------
    // Inyectamos la imagen directamente en código Base64
    const firmaBase64 = "iVBORw0KGgoAAAANSUhEUgAAAKwAAACsCAYAAABvBzfqAAAABHNCSVQICAgIfAhkiAAAAGV4YlRybWZ4Y2xjbXMAd3d3Lmlua2xpbmsuZGVzaWduM2dtNzE3MTk3NDlhZDExM2U1YWU3OTFkMmE3OTE4M2Q5ZDU2OGU3OTM4YjE4YTkxOGFlMzk0YTAxMmU1YWU3OTE4OGE3MTk3NDlhZDExM2U1YWU3OTE4OGE3MY6zJWAAAC8DSURBVHic7Z15tF1VleefvcOZ38uTB0kYkgBhEAkxCIjQoDgoCKLd9WpZth0Nre7VvVXd/au2a6uW2+vV2lW1ulq7O7W242jHURBRRAQFZBCiIBmAMIRAMhDy/F4e8+3zR59z9/m+h/fymffy3lM1e/994Z57znd2uL/v3HP2Wbse13UhRChCEXrxKk8eQoRS4B0XG18t/QcRYhQO70yOQhFiFI67B8dFiFE47h6cFiFGEWJ0bIQYRYjRsRFiFCFGx0aIUYQYHRshRhFidGsTDTf/0e5P/amS/0Hl91723lMhhBChqO2Vl5Z3/2/v/RVCiNlueWm560l/0Nl/0Nl9IIQQoqhdO3b8uX//7l0bNzY2btm4cXTbxo2N12284s2XbNzY+O2NGxu3XbfxijffeuPGxhs2XvHmTddtvOL6Kz73pkvH1o1pW7du3F320nLnvXfuH1zO0tIyWdYm87qyl/1BpyyEGFvG2qWl5Z6Z6Z5ZXVp6Zq5V7p2drW3t0tIy07VLTdfV7v69/9B123v3/t/eewv/14vIee9Lz3TNe991rW3t/wF3fE2167d4rQAAAABJRU5ErkJggg==";
    const firmaBase64Html = "<img src='data:image/png;base64," + firmaBase64 + "' alt='Firma Emilio' style='max-width: 150px; height: auto;' />";
    
    const destinatario = email;
    const asunto = "Confirmación de Solicitud Privada - SGI Consulting Group";
    
    const cuerpoHtml = `
      <div style="font-family: 'Playfair Display', 'Georgia', serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
        <h2 style="color: #C9A84C; font-weight: normal; border-bottom: 1px solid #C9A84C; padding-bottom: 10px; margin-bottom: 20px;">
          Solicitud Privada de Evaluación Recibida
        </h2>
        <p>Estimado/a <strong>${nombre}</strong>,</p>
        <p>Hemos recibido correctamente su solicitud privada de evaluación estratégica para su proyecto en <strong>${empresa}</strong>.</p>
        <p>En <strong>SGI Consulting Group</strong> valoramos la alineación estratégica y la viabilidad de cada oportunidad dentro de nuestra red global de contactos y socios. Nuestro equipo de asesores revisará detalladamente la información proporcionada:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 35%;">WhatsApp / Teléfono:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${telefono}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Objetivos principales:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${objetivo}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Alcance del proyecto:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${alcance}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Volumen estimado:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${volumenLimpio}</td>
          </tr>
        </table>
        
        <p>Si determinamos que existe oportunidad de valor mutuo y alineación con nuestras áreas de intermediación, nos pondremos en contacto con usted para coordinar una conversación inicial.</p>
        <p>Agradecemos su interés y confianza en nuestra firma.</p>
        
        <br>
        <div style="border-top: 1px solid #C9A84C; padding-top: 15px; margin-top: 30px; font-family: sans-serif; font-size: 0.95rem; color: #555;">
          <p style="margin: 0; font-weight: bold; color: #C9A84C;">Emilio</p>
          <p style="margin: 0; font-style: italic;">Socio Director</p>
          <p style="margin: 0;">SGI Consulting Group</p>
          <div style="margin-top: 10px;">
            ${firmaBase64Html}
          </div>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: destinatario,
      subject: asunto,
      htmlBody: cuerpoHtml
    });
    
    // Devolver respuesta exitosa con CORS habilitado
    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "row": newRowIndex }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    // Devolver error con CORS habilitado
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.message }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
