/* eslint-disable camelcase */
const host: string | undefined = process.env.SMTP_HOST
const port: number | undefined = parseInt(process.env.SMTP_PORT)
const user: string | undefined = process.env.SMTP_USER
const pass: string | undefined = process.env.SMTP_PASS
const userAlert: string | undefined = process.env.SMTP_EMAIL_ALERT
const passAlert: string | undefined = process.env.SMTP_PASS_ALERT
const from_name = process.env.SMTP_FROM_NAME
const from_email = process.env.SMTP_FROM_EMAIL
const from_email_alert = process.env.SMTP_FROM_EMAIL_ALERT
const smtpConfig = { host, port, user, pass, from_name, from_email, from_email_alert, userAlert, passAlert }

export { host, port, user, pass, from_name, from_email, from_email_alert, userAlert, passAlert }
export default smtpConfig
