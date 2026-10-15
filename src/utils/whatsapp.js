// Product purchases currently go through WhatsApp (payment gateway is switched off).
export const WHATSAPP_NUMBER = '4915236738625'

export function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function productWhatsAppUrl(product) {
  const price = Number(product.price)
  const priceText = Number.isFinite(price) ? ` (₹${price % 1 === 0 ? price : price.toFixed(2)})` : ''
  return whatsappUrl(
    `Hi EasyWay Germany, I would like to buy "${product.title}"${priceText}. Please share the payment details.`
  )
}
