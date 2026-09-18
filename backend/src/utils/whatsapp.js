import { env } from '../config/env.js';

export const generateWhatsAppLink = (order, items) => {
  let message = `*Nuevo Pedido #${order.id}*\n\n`;
  message += `*Cliente:* ${order.customerName}\n`;
  message += `*Teléfono:* ${order.customerPhone}\n`;
  message += `*Entrega:* Envío a domicilio\n`;
  
  if (order.customerProvince) {
    message += `*Provincia:* ${order.customerProvince}\n`;
  }
  if (order.customerCity) {
    message += `*Ciudad:* ${order.customerCity}\n`;
  }
  if (order.customerPostalCode) {
    message += `*Código Postal:* ${order.customerPostalCode}\n`;
  }
  // When individual fields are present, extract just the street address from the concatenated field
  if (order.customerProvince && order.customerAddress) {
    // customerAddress is "street, CP xxxx, province" — extract just the street part
    const streetOnly = order.customerAddress.split(',')[0]?.trim();
    if (streetOnly) {
      message += `*Dirección:* ${streetOnly}\n`;
    }
  } else if (order.customerAddress) {
    message += `*Dirección:* ${order.customerAddress}\n`;
  }

  message += `\n*Detalle del pedido:*\n`;
  items.forEach(item => {
    message += `- ${item.quantity}x ${item.product.name} ($${item.unitPrice}) = $${item.subtotal}\n`;
  });

  message += `\n*Total:* $${order.total}\n`;

  if (order.comments) {
    message += `\n*Comentarios:* ${order.comments}\n`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${env.WHATSAPP_PHONE}?text=${encodedMessage}`;
};
