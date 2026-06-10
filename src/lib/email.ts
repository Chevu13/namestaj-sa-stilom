import nodemailer from 'nodemailer'
import { generateOrderConfirmationEmail } from './email-template'
import { Order, OrderItem } from '@/types'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOrderConfirmationEmail(order: Order & { items: OrderItem[] }) {
  const html = generateOrderConfirmationEmail(order)

  const recipients = [process.env.SMTP_USER!] // uvek šalje na tvoj gmail
  if (order.customer_email && order.customer_email !== 'nema@email.com') {
    recipients.push(order.customer_email)
  }

  await transporter.sendMail({
    from: `"Nameštaj sa Stilom" <${process.env.SMTP_USER}>`,
    to: recipients.join(', '),
    subject: `Potvrda porudžbine ${order.order_number} — Nameštaj sa Stilom`,
    html,
  })
}
