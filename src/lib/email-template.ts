import { Order, OrderItem } from '@/types'
import { formatPrice } from '@/lib/utils'

export function generateOrderConfirmationEmail(order: Order & { items: OrderItem[] }): string {
  const statusMap: Record<string, string> = {
    nova: 'Nova',
    u_obradi: 'U obradi',
    poslato: 'Poslato',
    isporuceno: 'Isporučeno',
    otkazano: 'Otkazano',
  }

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid #f2e5cc; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; color: #2c2820;">
        ${item.product_name}
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid #f2e5cc; text-align: center; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; color: #524d41;">
        ${item.quantity}
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid #f2e5cc; text-align: right; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; color: #2c2820; font-weight: 500;">
        ${formatPrice(item.product_price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Potvrda porudžbine ${order.order_number}</title>
</head>
<body style="margin:0; padding:0; background-color:#fdfaf5; font-family:'DM Sans',system-ui,sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdfaf5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:4px; overflow:hidden; box-shadow: 0 4px 40px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#1a1814; padding: 48px 48px 40px; text-align:center;">
              <p style="margin:0 0 8px; font-size:11px; letter-spacing:4px; text-transform:uppercase; color:#d4a96a; font-family:'DM Sans',system-ui;">Nameštaj sa Stilom</p>
              <h1 style="margin:0; font-family:Georgia,serif; font-weight:300; font-size:32px; color:#fdfaf5; letter-spacing:-0.5px;">
                Hvala na porudžbini
              </h1>
              <p style="margin: 16px 0 0; font-size:14px; color:#9a9189; letter-spacing:0.5px;">
                Porudžbina je primljena i biće obrađena u najkraćem roku.
              </p>
            </td>
          </tr>

          <!-- Order number badge -->
          <tr>
            <td style="background-color:#f9f3e8; padding: 20px 48px; text-align:center; border-bottom: 1px solid #f2e5cc;">
              <p style="margin:0; font-size:12px; letter-spacing:3px; text-transform:uppercase; color:#9a9189;">Broj porudžbine</p>
              <p style="margin: 6px 0 0; font-family:Georgia,serif; font-size:28px; color:#1a1814; letter-spacing:2px; font-weight:400;">${order.order_number}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 48px;">
              
              <p style="margin: 0 0 32px; font-size:15px; color:#524d41; line-height:1.7;">
                Poštovani <strong>${order.customer_name}</strong>,<br/>
                Vaša porudžbina je uspešno primljena. Naš tim će Vas kontaktirati na broj <strong>${order.customer_phone}</strong> radi potvrde isporuke.
              </p>

              <!-- Products table -->
              <h2 style="margin:0 0 16px; font-family:Georgia,serif; font-size:20px; font-weight:400; color:#1a1814; letter-spacing:-0.3px;">Naručeni proizvodi</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="padding: 10px 0; text-align:left; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#9a9189; border-bottom: 2px solid #f2e5cc; font-weight:500;">Proizvod</th>
                    <th style="padding: 10px 0; text-align:center; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#9a9189; border-bottom: 2px solid #f2e5cc; font-weight:500;">Kol.</th>
                    <th style="padding: 10px 0; text-align:right; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#9a9189; border-bottom: 2px solid #f2e5cc; font-weight:500;">Cena</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 8px;">
                <tr>
                  <td style="padding: 12px 0; font-size:14px; color:#524d41;">Isporuka</td>
                  <td style="padding: 12px 0; text-align:right; font-size:14px; color:#524d41;">
                    ${order.delivery_cost === 0 ? '<span style="color:#2d6a4f;">Besplatna isporuka</span>' : formatPrice(order.delivery_cost)}
                  </td>
                </tr>
                <tr style="border-top: 2px solid #1a1814;">
                  <td style="padding: 16px 0 8px; font-family:Georgia,serif; font-size:20px; color:#1a1814;">Ukupno</td>
                  <td style="padding: 16px 0 8px; text-align:right; font-family:Georgia,serif; font-size:22px; color:#1a1814; font-weight:400;">${formatPrice(order.total_amount)}</td>
                </tr>
              </table>

              <!-- Payment method -->
              <div style="margin: 24px 0; padding: 16px 20px; background: #f9f3e8; border-left: 3px solid #d4a96a; border-radius: 2px;">
                <p style="margin:0; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#9a9189;">Način plaćanja</p>
                <p style="margin: 4px 0 0; font-size:15px; color:#1a1814; font-weight:500;">Plaćanje pouzećem</p>
              </div>

              <!-- Delivery address -->
              <h2 style="margin:24px 0 12px; font-family:Georgia,serif; font-size:20px; font-weight:400; color:#1a1814;">Adresa isporuke</h2>
              <div style="padding: 20px; background: #f9f3e8; border-radius: 2px;">
                <p style="margin:0; font-size:15px; color:#2c2820; line-height:1.8;">
                  ${order.customer_name}<br/>
                  ${order.address}<br/>
                  ${order.postal_code} ${order.city}<br/>
                  <span style="color:#524d41;">${order.customer_phone}</span>
                </p>
              </div>

              ${order.notes ? `
              <div style="margin-top: 20px; padding: 16px 20px; border: 1px solid #f2e5cc; border-radius: 2px;">
                <p style="margin:0 0 4px; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#9a9189;">Napomena</p>
                <p style="margin:0; font-size:14px; color:#524d41;">${order.notes}</p>
              </div>
              ` : ''}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1a1814; padding: 32px 48px; text-align:center;">
              <p style="margin:0 0 8px; font-family:Georgia,serif; font-size:18px; color:#fdfaf5; font-weight:300;">Nameštaj sa Stilom</p>
              <p style="margin:0; font-size:13px; color:#9a9189;">Vaš pouzdani partner za nameštaj</p>
              <p style="margin: 20px 0 0; font-size:11px; color:#524d41;">
                Ukoliko imate pitanja, kontaktirajte nas na: 
                <a href="mailto:vukrajovic95@gmail.com" style="color:#d4a96a; text-decoration:none;">vukrajovic95@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `
}
