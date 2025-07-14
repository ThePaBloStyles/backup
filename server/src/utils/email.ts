import * as nodemailer from 'nodemailer';

// Configuración del transportador de email
const createTransporter = () => {
  // Puedes usar diferentes proveedores de email
  // Aquí un ejemplo con Gmail (configurar en .env)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'tu-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'tu-app-password'
    }
  });

  // Para otros proveedores como SendGrid, Mailgun, etc:
  /*
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'apikey',
      pass: process.env.SMTP_PASSWORD || 'tu-api-key'
    }
  });
  */
};

/**
 * Enviar email
 * @param to Destinatario
 * @param subject Asunto
 * @param html Contenido HTML
 * @param from Remitente (opcional)
 */
export const sendEmail = async (
  to: string, 
  subject: string, 
  html: string, 
  from?: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: from || process.env.EMAIL_FROM || '"Tu Tienda" <noreply@tutienda.com>',
      to: to,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente:', result.messageId);
    return true;

  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
};

/**
 * Validar formato de email
 * @param email Email a validar
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Plantilla base para emails
 * @param content Contenido del email
 * @param title Título del email
 */
export const createEmailTemplate = (content: string, title: string = 'Tu Tienda'): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #0066CC;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #0066CC;
          margin: 0;
        }
        .content {
          margin-bottom: 30px;
        }
        .footer {
          border-top: 1px solid #eee;
          padding-top: 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          padding: 12px 25px;
          background-color: #0066CC;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 15px 0;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Tu Tienda</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Este es un email automático, por favor no respondas.</p>
          <p>Si tienes preguntas, contáctanos en: contacto@tutienda.com</p>
          <p>&copy; ${new Date().getFullYear()} Tu Tienda. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
