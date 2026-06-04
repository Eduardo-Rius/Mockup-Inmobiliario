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
    const imageBlob = getLogoBlob();
    
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
            <img src="cid:firmaImage" alt="Firma Emilio" style="max-width: 150px; height: auto; display: block;" />
          </div>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: destinatario,
      subject: asunto,
      htmlBody: cuerpoHtml,
      inlineImages: {
        firmaImage: imageBlob
      }
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

function testEmail() {
  const email = Session.getActiveUser().getEmail();
  if (!email) {
    Logger.log("No se pudo obtener el email del usuario activo. Por favor ingresa tu email manualmente para probar.");
    return;
  }
  
  Logger.log("Enviando email de prueba a: " + email);
  try {
    const imageBlob = getLogoBlob();
    MailApp.sendEmail({
      to: email,
      subject: "Email de Prueba - SGI",
      htmlBody: "Este es un correo de prueba de SGI. <br><img src='cid:firmaImage' />",
      inlineImages: {
        firmaImage: imageBlob
      }
    });
    Logger.log("Email enviado con éxito.");
  } catch (e) {
    Logger.log("Error al enviar email: " + e.toString());
  }
}


function getLogoBlob() {
  const logoUrl = "https://raw.githubusercontent.com/Eduardo-Rius/Mockup-Inmobiliario/main/SGI%20Logo%20Removed%20Background.png";
  try {
    return UrlFetchApp.fetch(logoUrl).getBlob().setName("firmaImage");
  } catch (e) {
    Logger.log("Error fetching logo from GitHub, using transparent fallback: " + e.message);
    // Retornamos un blob de 1px transparente como fallback
    return Utilities.newBlob(Utilities.base64Decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="), "image/png", "firmaImage");
  }
}