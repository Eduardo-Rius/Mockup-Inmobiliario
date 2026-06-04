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
    const firmaBase64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCALqBH8DASIAAhEBAxEB/8QAGwABAQADAQEBAAAAAAAAAAAAAAECAwUEBgf/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAC+YsyM88bm0RUpUFSlgXLHKWljLdr3y3Jc0oxWJFlJYSgi0SiyjLHKGUzVblEqiylyxsZ3HLNtlBBYEuNY43GsccsdSSyyWCxKmOeNnL8ns8fTAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcsNkudxubUpUsVBQUFsstzw3y7PQ3c9a2ZNeOyGEyVjLKSxIAKAWWGSlzmctyWItIolIyssuVxoCwiIlTDLCpjZqQWQgFiUcrx+3xdcBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADZr2ZuVxstuNKCpYWUqUWWM/Z5vbjW/OZc94somEzlmubMawxzlYLLIoksFBVLVMtmOzNUChKiKVljYyQuTGklxsRiTG4aiRZUUICkpZyvF7fF1wFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM8Mpc0ubbjSgqDJEZIMrjnLv8AZ5fVz16MsM+eqtMZks147JZqmzGsMNss1M5bgolUFMqsZ7NeyKCgSiCUIqFqLLihMbhYws1ABKpACiuV4vb4uvMKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWWLlilzY5RUq0hbBkiLt1bZfT6fNv5637NOzGttmURRjMpZjjsx1Nc2Qwx2Q1TbjWDKEyC5Y02Z4ZRlZQAsEqWCELYhEiphcbELFSqgEKgorl+L2+LrgLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxpbLLbjYtlioW2UWDLbp3Zvo3+fdz1u26M830ZadkubEmUKixJLKiwYZQwmeNQFsyM88M4tJVSxUBISxUuIiWSMakiwKqUJREKirYOZ4vb4uuAsAAAAAAAAAAAAAAAAAACggAAAAAAAAAAAAACWUtiW3GxbBklhYXKKXbq25u/bo2Y1uz1Z5u3ZozjfdWRncSVBYUlxJLiIxKkrPLXnGzPHKXKwWAQWACYzLFZjlhZMbKxmWNhFWwZRABQiq5fj9nj64CwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACWUqWWpSpYWDJLFC5bdW2XPZryxduerLN256c425acjflozNjDIymIsxhZIIlCGWWGRuz1Z5bGKXJAsFQVFIxJjljZjLKkLMSVbBlAVBYFiuZ4/Z4+uAsAAAAAAAL648bsZS8V2acV2RxnZHGdgcd14cl1hyXVhy3ULy3THMdMnMdMcx0hzXSHNdIc10hzXSHNdIvNdInNdIc17PHYFAAAASwLBkJalipS2WKVbs15xnlryzdmerPN23XlLsuvI2XXkZ5ahumqmeMkZMbViFQZJDZnoyjfdVl23XlGbGlQW4qYsRE1GKUQiJVSmUsBCxUllrmeP2ePrkLAAAAAB0I8fc6Ozj0x3ary3sarGxgMmMM5gMpjCyQyY0yspapLkJlakZUxZjFnawbBrudNbYNd2QwZ1NbZF+d+e+g+f9PMN5AAAAl3XN0PQPPd40XbI13OLKoqlssWyy55a8o2Za8s3ZcLLsY0uWFMkFQW4oyY2rEKkMrhTPLVTddOUu7LTlGy66ZzEIxqxLIksIolFCxDJAWFS1zPH7PH1wFgAAAA9Uenv43z9crjeerJkRtxrBkMZmMJmNbYNV2DXc6Y5UWypbiM8tdM7hDa1DddA9Dzq9F8xPS80PVfJT1PIPU8w4vz/AHuD6MBvIAAAHqtnPRZCgrIlyyl1zfDRh6cTztuNYkrO4WNmerPNzywsZ3CrlcbGbEZSQyYUzY0rGpZLVQVKtQmeWvKXZddjO4FqSysQhYhSoVKlgoFQlFvN8fr8nXAWAAAAX6jid/jtlqvDrty177M+Vzed35ejXrdM7GsbGsbGsbGsbGsbGsbGsbGsbGsbGsbGsbGsbGsZsBmwGbAZsBmwGbAZYlAAAAAexXLUUTJRblKzllQJLEmOcXCZq0zdimGTGtmWrKXO4WNlwsZMBlcKZXGlQZJDK4jIFSlBbBlcKZMRkxFgEtShFhQAWWAtVKczyery9cBYAAAlHf8ARJ5e2dwZ16Od0/lOvPUO/MKFiT3+vN4r6Gy/O36DBOE6Ph0wFgAAA9Eed1N2bxXbLxHa8tnPZ4agAAAAAAAAAAHtWctVaq1DObJYykYzKVjMsSLCgkyhjjsxNbOWSwZMauTGmVxSZIMrjVtxpbBbKLLFIW40qDJBUlZMaWwSwUIsFJQFBYHO8nq8vXAUAAAyxyj6fVs1+buEen5P6r5TtzDrhcezLr7eGvz9N+vFjSWkrIzuGRzuF9f5+2PlydudBfRl9Rz15PfvvDprzysYsxrw9A8PI+lx1PgcPqvmPRzwGpfrfkvs+W83ucdeG+0fM8D6D5/0YDeQAAAPfK5auWOcstsuWxnLhjniYTKJjMsaiwWCwhLKkyhjMiYLKqUqUqWWpSp3GmSDK40yQZIKlAi3HKogtgpBUstxpSRZljasyQlCU5vl9Xl64CgAAGWOUfTaturzd6XN3/KfV/Kd+UHXHp+j8Hp4dSOW87hkZM8013OCspVtThcb675L1cmWPQ1O70cNnl6qZK11tvmyN9xzSKrD5f6znanxTPD0879n8Z9py30VcdRR8x8/9B8/6MBvIAAAHQLy0zwzlueO2XZcri6sdmNa8dmFYTPFMZljSWJbC2WRFhJkrBYSZSyXGlsosRklW2DK4jJBkgySiwUpLBUpLLYShQsFmeMWFECweDyery9cBQAADLHKPptezDy91qXb8p9V8r35QvXH0s26/L2Vc6m3Vo1nzeHy30cvd3vk+xjXauV8/SZXI1fGfbfI9+fl73B+j1O3lXm6Fteb5nrfKdsejLzOmfpO/8N9px36FYrTuwr4Xy9Dn+jnftPi/tMa6crjqLD5n576H570YDeQAAAOhZeWrljlLs3afRnW1kw1Y7MK14541hjnjZhMpWKwFEqICKrGUYrLJMoSxVuNigyuKXIJbjS2FqUqUtgsChCWgALZTKMVoQgWDweX0+brgKAAAZY5R9NjlPL3Fl2fKfV/Kd+UsvXH1OGevy9rZc6eL2+LeOHT08nU5fSzfpMmfk7TK5Jq+P+x+P7Z8f0vzX0u895Xn6KJwvl/p/mPRijpn0fafF/a8d+scqxyxt+L5vT5no537T4v7TF6ZOO6Q+Z+e+h+e9GA3kAAADoXG8tZXGy7vT5PXjXomUxcNe3XWvHPCzHDPGzGWVJlCFIokogqSiSwgSTKVLjTJiMkpbjS3FGVxpUGVxLlcaVFZJZCWiC2ZBIZxC2BLiCV4fP6PP0wFAAAMsco+nleXvLbm5fJ/WfJ+jlLHXH1WGU8nYtlni9/i3ngj08nS53QzfqNmG3y9VZRp+O+y+M7Y8n03zP02531efarXz/zH1Hy3fFHTPo+0+L+0479ks5aY54HxvM6fM9PO/afF/aYvTlnHZB81899D896MBvIAAAHefH5Zq998fnur33z+e6vvfn1v0D5/eZ9F8/vM+i+f3mfRfP7zPrsfnh9BPD1y2cT0417L7/AOeWfQPn6l73z+1dfnvp5Y4bFpYgspUpUsoiiKIoiwi2WSwWywWyixF26dksywzxrOxmI1gAASoKlGvbrsvK8np8vXAWAAX1x4/Z4+ucnSHNdMcp1ByXWicnK9aORl1JXHdhHDegcR2hxb2s1nFdoOK7WacV9dZ419QvKdaORl05XLe6zkOwOQ69l4rtWcZ2tRx9/Yuc9j0p2eO+h469vzzYegY2M5gMpjCyQyY0tkoAiwqFlhYpUFSlsC2WKUqUqUqUqUpZLEWCwWBLjS2C0SwWwUCwUCwUFgpLCgWCgWCgWAAAAACgAAAAAAAsCwAAAAAAAAAFhSgAAAAAAAAAAAAAAAAAACwLAAAAAAAAAAAAAAAAAAAAABYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z";
    
    // Convertimos la firma Base64 a un Blob para incrustarlo
    const base64Data = firmaBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    const imageBlob = Utilities.newBlob(Utilities.base64Decode(base64Data), "image/jpeg", "firmaImage");
    
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
