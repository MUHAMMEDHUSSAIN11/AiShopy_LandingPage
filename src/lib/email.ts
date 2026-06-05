import nodemailer from 'nodemailer'
import { CONTACT_EMAIL } from '@/lib/constants'
import type { WaitlistFormData } from '@/lib/schemas'

function getTransporter() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    throw new Error('SMTP credentials are not configured. Set SMTP_USER and SMTP_PASS.')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

export async function sendWaitlistNotification(data: WaitlistFormData) {
  const transporter = getTransporter()
  const from = process.env.SMTP_USER ?? CONTACT_EMAIL
  const storeUrl = data.storeName.trim()
    ? `${data.storeName.trim()}.aishopy.com`
    : 'Not provided yet'

  await transporter.sendMail({
    from: `"AiShopy Waitlist" <${from}>`,
    to: CONTACT_EMAIL,
    replyTo: data.email,
    subject: `New Waitlist Signup — ${data.name}`,
    text: [
      'New waitlist signup on AiShopy',
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Store URL: ${storeUrl}`,
      '',
      `Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    ].join('\n'),
    html: `
      <div style="font-family: sans-serif; max-width: 520px; color: #1a1a1a;">
        <h2 style="color: #2DB84C; margin-bottom: 16px;">New Waitlist Signup</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; width: 120px;">Name</td>
            <td style="padding: 8px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Store URL</td>
            <td style="padding: 8px 0;">${storeUrl}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; font-size: 13px; color: #666;">
          Submitted via aishopy.com waitlist form
        </p>
      </div>
    `,
  })
}
