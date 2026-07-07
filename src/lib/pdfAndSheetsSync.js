const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyEgyG27bMucBl9iNzl40LJ_vbYnsb6N2cv73LC0Ef0C5BhA82Kr_asud-1YiwQPR44/exec";

/**
 * Triggers the Google Apps Script POST webhook to sync order to Google Sheets & send automated Gmails
 */
export async function triggerGoogleSheetsSync(payload) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Required by standard Apps Script CORS setup
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.error("Error in Google Apps Script sync:", error);
    return false;
  }
}

/**
 * Uploads a PDF Blob to a temporary files sharing provider (tmpfiles.org with file.io fallback)
 * Returns the direct download URL or empty string on failure
 */
export async function uploadPdfToCloud(pdfBlob, orderNumber) {
  const filename = `Nota_de_Pedido_PD_${orderNumber}.pdf`;

  // Attempt 1: tmpfiles.org (unlimited direct downloads)
  try {
    const formData = new FormData();
    formData.append("file", pdfBlob, filename);

    const response = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.data && data.data.url) {
        // Convert the standard viewing URL to a direct download URL
        return data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      }
    }
  } catch (e) {
    console.warn("tmpfiles.org upload failed, falling back to file.io...", e);
  }

  // Attempt 2: file.io fallback
  try {
    const formData = new FormData();
    formData.append("file", pdfBlob, filename);

    const response = await fetch("https://file.io/?expires=1d", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.link) {
        return data.link;
      }
    }
  } catch (e) {
    console.error("All PDF upload providers failed:", e);
  }

  return "";
}

/**
 * Returns a styled HTML content template specifically customized for Patitas Dormilonas wholesale order PDF.
 */
export function getPdfTemplateHtml(order, dateStr) {
  const subtotal = order.subtotal || 0;
  const total = order.total || 0;
  const discount = order.discount || 0;
  const igvAmount = (total * 18) / 118;
  const docType = order.customerInfo.docType || "RUC";
  const docVal = docType === "RUC" ? order.customerInfo.ruc : order.customerInfo.dni;
  
  const addressBlock = `${order.shippingAddress.address}, ${order.shippingAddress.district}, ${order.shippingAddress.province}, ${order.shippingAddress.department}`;
  const reference = order.shippingAddress.reference ? ` (Ref: ${order.shippingAddress.reference})` : "";
  const agency = order.customerInfo.freightAgency || "Shalom";

  let itemsHtml = "";
  if (order.items && order.items.length > 0) {
    itemsHtml = order.items.map((item) => {
      const pSku = `PT-${item.productId.slice(0, 4).toUpperCase()}`;
      const desc = `${item.name} (${item.size}, ${item.color})`;
      const sub = item.price * item.quantity;
      return `
        <tr style="border-bottom: 1px solid #EBE3D5;">
          <td style="padding: 10px; text-align: left; color: #433D3C;">
            <div style="font-weight: bold; font-size: 11px;">${desc}</div>
            <div style="font-size: 9px; color: #8D7B68; font-family: monospace;">SKU: ${pSku}</div>
          </td>
          <td style="padding: 10px; text-align: center; font-weight: bold; color: #3E2723; font-size: 11px;">${item.quantity}u</td>
          <td style="padding: 10px; text-align: right; color: #433D3C; font-family: monospace; font-size: 11px;">S/. ${item.price.toFixed(2)}</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; color: #3E2723; font-family: monospace; font-size: 11px;">S/. ${sub.toFixed(2)}</td>
        </tr>
      `;
    }).join("");
  }

  return `
    <!-- hidden pdf template layout optimized for html2pdf captures -->
    <div id="pdf-template-container" style="width: 794px; height: 1120px; max-height: 1120px; overflow: hidden; background-color: #FDFCF0; padding: 40px 45px 90px 45px; font-family: 'Inter', sans-serif; color: #433D3C; line-height: 1.5; box-sizing: border-box; position: relative;">
      
      <!-- Top Header Row -->
      <div style="display: table; width: 100%; border-bottom: 3px solid #3E2723; padding-bottom: 15px; margin-bottom: 20px;">
        <div style="display: table-cell; width: 55%; vertical-align: top;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px; font-weight: bold; color: #3E2723; font-family: 'Fraunces', serif;">Patitas Dormilonas</span>
            <span style="font-size: 11px; background-color: #A66C33; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; letter-spacing: 0.5px;">B2B</span>
          </div>
          <span style="font-size: 10px; color: #8D7B68; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: block; margin-top: 2px;">Fábrica & Distribuidora de Camas de Mascotas</span>
          <div style="font-size: 10px; color: #7A6A53; margin-top: 8px; line-height: 1.4;">
            <p style="margin: 1px 0;"><strong>RUC:</strong> 20612345678 (PATITAS DORMILONAS S.A.C.)</p>
            <p style="margin: 1px 0;"><strong>Almacén Central:</strong> Av. Las Lomas 450, Urb. El Derby, Santiago de Surco, Lima</p>
            <p style="margin: 1px 0;"><strong>WhatsApp Mayorista:</strong> (+51) 951 771 314 | <strong>Email:</strong> ventas@patitasdormilonas.pe</p>
          </div>
        </div>
        <div style="display: table-cell; width: 45%; text-align: right; vertical-align: top;">
          <div style="border: 2px solid #3E2723; padding: 12px 15px; border-radius: 12px; background-color: #FCF9F2; display: inline-block; text-align: right;">
            <span style="font-size: 9px; font-weight: bold; color: #A66C33; display: block; text-transform: uppercase; letter-spacing: 1.5px;">NOTA DE PEDIDO MAYORISTA</span>
            <span style="font-size: 14px; font-weight: bold; font-family: monospace; color: #3E2723; display: block; margin-top: 2px;">${order.orderNumber}</span>
          </div>
          <div style="font-size: 10px; color: #7A6A53; margin-top: 8px;">
            <p style="margin: 1px 0;"><strong>Fecha de Emisión:</strong> <span>${dateStr}</span></p>
            <p style="margin: 1px 0;"><strong>Estado:</strong> <span style="color: #059669; font-weight: bold; text-transform: uppercase; background-color: #d1fae5; padding: 2px 6px; border-radius: 4px; font-size: 9px; display: inline-block;">PAGADO - TRANSFERENCIA</span></p>
          </div>
        </div>
      </div>

      <!-- Buyer Information Section -->
      <div style="background-color: #FCF9F2; border: 1px solid #EBE3D5; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
        <h3 style="font-size: 10px; font-weight: bold; color: #3E2723; text-transform: uppercase; margin-top: 0; margin-bottom: 8px; border-bottom: 1px solid #EBE3D5; padding-bottom: 4px; letter-spacing: 0.5px;">DATOS COMERCIALES DEL ADQUIRIENTE (B2B)</h3>
        <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
          <tr>
            <td style="padding: 3px 0; width: 30%; color: #8D7B68;"><strong>Razón Social / Nombre:</strong></td>
            <td style="padding: 3px 0; font-weight: bold; color: #3E2723;">${order.customerInfo.name} ${order.customerInfo.lastName} ${order.customerInfo.businessName ? `(${order.customerInfo.businessName})` : ""}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #8D7B68;"><strong>DNI / RUC Comercial:</strong></td>
            <td style="padding: 3px 0; font-family: monospace; color: #3E2723;">${docVal || "-"} (${docType})</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #8D7B68;"><strong>Celular / WhatsApp:</strong></td>
            <td style="padding: 3px 0; color: #3E2723;">${order.customerInfo.phone}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #8D7B68;"><strong>Correo Electrónico:</strong></td>
            <td style="padding: 3px 0; color: #3E2723;">${order.customerInfo.email}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #8D7B68;"><strong>Agencia de Carga:</strong></td>
            <td style="padding: 3px 0; font-weight: bold; color: #A66C33;">${agency} (Pago Contra Entrega en Destino)</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #8D7B68;"><strong>Dirección de Despacho:</strong></td>
            <td style="padding: 3px 0; color: #3E2723;">${addressBlock}${reference}</td>
          </tr>
        </table>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; font-size: 10px; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #3E2723; color: white;">
            <th style="padding: 8px 10px; text-align: left; border-top-left-radius: 6px; border-bottom-left-radius: 6px; font-weight: bold; text-transform: uppercase; font-size: 9px;">Descripción del Producto</th>
            <th style="padding: 8px 10px; text-align: center; width: 15%; font-weight: bold; text-transform: uppercase; font-size: 9px;">Cantidad</th>
            <th style="padding: 8px 10px; text-align: right; width: 20%; font-weight: bold; text-transform: uppercase; font-size: 9px;">Precio Unit.</th>
            <th style="padding: 8px 10px; text-align: right; width: 20%; border-top-right-radius: 6px; border-bottom-right-radius: 6px; font-weight: bold; text-transform: uppercase; font-size: 9px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Bottom Layout - Terms & Stamp Left, Calculations Right -->
      <div style="display: table; width: 100%; margin-top: 15px;">
        <!-- Terms and Stamp -->
        <div style="display: table-cell; width: 55%; font-size: 9px; color: #7A6A53; line-height: 1.5; vertical-align: top; padding-right: 20px; box-sizing: border-box;">
          <p style="margin: 0 0 5px 0; font-weight: bold; color: #3E2723; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px;">TÉRMINOS DE ENTREGA Y GARANTÍA:</p>
          <ul style="margin: 0; padding-left: 12px; color: #7A6A53;">
            <li>Esta Nota de Pedido confirma el pago de la cotización al por mayor.</li>
            <li>El despacho se coordinará mediante la agencia elegida en las próximas 24 horas hábiles.</li>
            <li>Ofrecemos garantía de 1 año contra deformaciones en espuma de alta densidad.</li>
          </ul>

          <!-- Corporate Stamp Mock -->
          <div style="margin-top: 20px; display: table; width: 100%;">
            <div style="display: table-cell; width: 60px; vertical-align: middle;">
              <div style="width: 55px; height: 55px; border: 2px dashed #A66C33; border-radius: 50%; box-sizing: border-box; position: relative; opacity: 0.8; text-align: center; color: #A66C33;">
                <div style="position: absolute; top: 2px; left: 2px; right: 2px; bottom: 2px; border: 1px solid #A66C33; border-radius: 50%; box-sizing: border-box; padding-top: 5px;">
                  <div style="font-size: 5px; font-weight: bold; line-height: 1.1; font-family: sans-serif;">DESPACHADO</div>
                  <div style="font-size: 7px; font-weight: bold; line-height: 1.2; margin-top: 1px; font-family: sans-serif;">S. GARCÍA</div>
                  <div style="font-size: 4px; font-weight: normal; line-height: 1.1; margin-top: 1px; font-family: sans-serif;">RUC 20612345678</div>
                </div>
              </div>
            </div>
            <div style="display: table-cell; vertical-align: middle; padding-left: 10px; font-size: 8px; line-height: 1.4; color: #433D3C;">
              <p style="margin: 0; font-weight: bold; color: #3E2723;">Sonia García Castro</p>
              <p style="margin: 0; color: #8D7B68;">Ventas Corporativas y Mayoristas</p>
              <p style="margin: 0; color: #8D7B68;">Patitas Dormilonas S.A.C.</p>
            </div>
          </div>
        </div>

        <!-- Calculations Breakdown -->
        <div style="display: table-cell; width: 45%; vertical-align: top;">
          <div style="background-color: #FCF9F2; border: 1px solid #EBE3D5; border-radius: 12px; padding: 12px 15px; box-sizing: border-box; width: 100%;">
            <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; color: #8D7B68;">Subtotal:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; font-family: monospace; color: #3E2723;">S/. ${subtotal.toFixed(2)}</td>
              </tr>
              ${discount > 0 ? `
              <tr>
                <td style="padding: 4px 0; color: #059669;">Descuento Cupón:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; font-family: monospace; color: #059669;">- S/. ${discount.toFixed(2)}</td>
              </tr>
              ` : ""}
              <tr>
                <td style="padding: 4px 0; color: #8D7B68;">IGV (18% Incluido):</td>
                <td style="padding: 4px 0; text-align: right; font-family: monospace; color: #8D7B68;">S/. ${igvAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #8D7B68;">Gasto de Envío:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #059669;">GRATIS (Flete en destino)</td>
              </tr>
              <tr style="border-top: 1px dashed #EBE3D5;">
                <td style="padding: 8px 0 0 0; color: #3E2723; font-size: 11px; font-weight: bold;">TOTAL PAGADO:</td>
                <td style="padding: 8px 0 0 0; text-align: right; font-size: 13px; font-weight: 900; font-family: monospace; color: #A66C33;">S/. ${total.toFixed(2)}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer certification -->
      <div style="position: absolute; bottom: 40px; left: 45px; width: 704px; border-top: 1px solid #EBE3D5; padding-top: 12px; display: table;">
        <div style="display: table-cell; width: 85%; font-size: 8px; color: #8D7B68; vertical-align: middle;">
          <p style="margin: 1px 0;">Este documento es una representación digital formal de la transacción de compra mayorista.</p>
          <p style="margin: 1px 0;">Verificado mediante la pasarela de pagos integrada de Patitas Dormilonas. Fecha de certificación: ${dateStr}.</p>
        </div>
        <div style="display: table-cell; width: 15%; text-align: right; vertical-align: middle;">
          <!-- QR Code CSS mockup -->
          <div style="width: 40px; height: 40px; border: 1px solid #3E2723; padding: 2px; box-sizing: border-box; background-color: white; position: relative; display: inline-block;">
            <div style="position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border: 2.5px solid #3E2723; box-sizing: border-box; background-color: white;"></div>
            <div style="position: absolute; top: 2px; right: 2px; width: 10px; height: 10px; border: 2.5px solid #3E2723; box-sizing: border-box; background-color: white;"></div>
            <div style="position: absolute; bottom: 2px; left: 2px; width: 10px; height: 10px; border: 2.5px solid #3E2723; box-sizing: border-box; background-color: white;"></div>
            <div style="position: absolute; top: 15px; left: 5px; width: 3px; height: 3px; background-color: #3E2723;"></div>
            <div style="position: absolute; top: 20px; left: 15px; width: 3px; height: 3px; background-color: #3E2723;"></div>
            <div style="position: absolute; top: 8px; left: 15px; width: 3px; height: 3px; background-color: #3E2723;"></div>
            <div style="position: absolute; top: 15px; right: 5px; width: 3px; height: 3px; background-color: #3E2723;"></div>
            <div style="position: absolute; bottom: 8px; right: 8px; width: 5px; height: 3px; background-color: #3E2723;"></div>
            <div style="position: absolute; bottom: 5px; right: 13px; width: 3px; height: 5px; background-color: #3E2723;"></div>
          </div>
        </div>
      </div>

    </div>
  `;
}
