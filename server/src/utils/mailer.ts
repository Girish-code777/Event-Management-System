import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

let transporter: nodemailer.Transporter | null = null

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

export async function sendMail(opts: { to: string; subject: string; text: string; html?: string }) {
  if (!transporter) {
    console.warn('[mailer] SMTP not configured; skipping email to', opts.to)
    return
  }
  const from = process.env.SMTP_FROM || SMTP_USER as string
  await transporter.sendMail({ from, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html })
}
