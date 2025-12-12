const axios = require('axios');

// Configurar MailerSend
const apiKey = process.env.SENDGRID_API_KEY;
const mailerSendToken = apiKey; // Reutilizamos la misma variable para el token de MailerSend
const MAILER_SEND_API_URL = 'https://api.mailersend.com/v1';

if (mailerSendToken) {
  console.log('✅ Token MailerSend configurado correctamente');
} else {
  console.log('❌ SENDGRID_API_KEY (MailerSend token) no encontrada en variables de entorno');
}

/**
 * Servicio de email usando SendGrid API
 */
class EmailService {
  /**
   * Enviar email de recuperación de contraseña
   * @param {string} to - Email del destinatario
   * @param {string} resetToken - Token de reset
   * @param {string} userName - Nombre del usuario
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendPasswordResetEmail(to, resetToken, userName) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@test-xkjn41m1e954z781.mlsender.net';
      const fromName = process.env.SENDGRID_FROM_NAME || 'Sistema de Tickets DuvyClass';

      // Preparar datos para MailerSend API
      const emailData = {
        from: {
          email: fromEmail,
          name: fromName
        },
        to: [
          {
            email: to,
            name: userName
          }
        ],
        subject: 'Recuperación de Contraseña - Sistema de Tickets',
        html: this.generatePasswordResetEmailTemplate(userName, resetUrl),
        text: `Hola ${userName},\n\nHas solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña: ${resetUrl}\n\nSi no solicitaste este cambio, puedes ignorar este email.\n\nSaludos,\nEquipo de Sistema de Tickets`
      };

      console.log(`📧 Enviando email de reset a: ${to}`);
      
      // Enviar email usando MailerSend API
      const response = await axios.post(`${MAILER_SEND_API_URL}/email`, emailData, {
        headers: {
          'Authorization': `Bearer ${mailerSendToken}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      console.log('✅ Email enviado exitosamente');
      
      return {
        success: true,
        messageId: response.data.message_id || 'unknown',
        status: response.status
      };

    } catch (error) {
      console.error('❌ Error enviando email de reset:', error);
      
      // Manejo de errores específicos de MailerSend
      if (error.response) {
        const { status, data } = error.response;
        console.error('📊 MailerSend Error Status:', status);
        console.error('📋 MailerSend Error Body:', data);
        
        return {
          success: false,
          error: `Error de MailerSend (${status}): ${data.message || 'Error desconocido'}`
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generar template HTML para email de recuperación de contraseña
   * @param {string} userName - Nombre del usuario
   * @param {string} resetUrl - URL de reset
   * @returns {string} - HTML del email
   */
  generatePasswordResetEmailTemplate(userName, resetUrl) {
    const currentYear = new Date().getFullYear();
    
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña - Sistema de Tickets</title>
        <style>
            /* Reset y base */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #1a1a1a;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            
            .email-wrapper {
                background-color: #f5f5f5;
                padding: 40px 20px;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 2px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }
            
            /* Header corporativo con marca */
            .header {
                background: #662d91;
                padding: 48px 40px;
                text-align: center;
                position: relative;
            }
            
            .logo-container {
                margin-bottom: 24px;
            }
            
            .logo {
                width: 64px;
                height: 64px;
                background: #ffffff;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .header h1 {
                font-size: 28px;
                font-weight: 600;
                color: #ffffff;
                margin: 0;
                letter-spacing: -0.5px;
            }
            
            .header-subtitle {
                font-size: 15px;
                color: rgba(255, 255, 255, 0.9);
                margin-top: 8px;
                font-weight: 400;
            }
            
            /* Contenido principal */
            .content {
                padding: 48px 40px;
            }
            
            .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 24px;
            }
            
            .greeting-name {
                color: #662d91;
            }
            
            .message {
                font-size: 15px;
                color: #4a4a4a;
                margin-bottom: 20px;
                line-height: 1.7;
            }
            
            .message strong {
                color: #1a1a1a;
                font-weight: 600;
            }
            
            /* Caja destacada */
            .highlight-box {
                background: #fafafa;
                border-left: 4px solid #662d91;
                padding: 24px;
                border-radius: 2px;
                margin: 32px 0;
            }
            
            .highlight-title {
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 12px;
                font-size: 16px;
            }
            
            .highlight-text {
                color: #4a4a4a;
                font-size: 15px;
                line-height: 1.6;
            }
            
            /* Botón principal corporativo */
            .cta-container {
                text-align: center;
                margin: 40px 0;
            }
            
            .reset-button {
                display: inline-block;
                background: #662d91;
                color: #ffffff;
                padding: 16px 48px;
                text-decoration: none;
                border-radius: 2px;
                font-weight: 600;
                font-size: 15px;
                letter-spacing: 0.3px;
                box-shadow: 0 2px 8px rgba(102, 45, 145, 0.3);
                transition: all 0.3s ease;
            }
            
            .reset-button:hover {
                background: #7a3ba8;
                box-shadow: 0 4px 12px rgba(102, 45, 145, 0.4);
            }
            
            /* Grid de información profesional */
            .info-grid {
                display: table;
                width: 100%;
                margin: 32px 0;
                border-collapse: separate;
                border-spacing: 12px 0;
            }
            
            .info-item {
                display: table-cell;
                width: 33.33%;
                background: #fafafa;
                border: 1px solid #e8e8e8;
                border-radius: 2px;
                padding: 24px 16px;
                text-align: center;
                vertical-align: top;
            }
            
            .info-icon {
                font-size: 28px;
                margin-bottom: 12px;
                display: block;
                opacity: 0.9;
            }
            
            .info-title {
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .info-text {
                font-size: 13px;
                color: #6a6a6a;
                line-height: 1.5;
            }
            
            /* Alerta de seguridad empresarial */
            .security-box {
                background: #fff9f0;
                border: 1px solid #f5d899;
                border-radius: 2px;
                padding: 28px;
                margin: 32px 0;
            }
            
            .security-header {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
            }
            
            .security-icon {
                font-size: 24px;
                margin-right: 12px;
            }
            
            .security-title {
                font-weight: 600;
                color: #8b6914;
                font-size: 16px;
                margin: 0;
            }
            
            .security-text {
                color: #8b6914;
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 16px;
            }
            
            .security-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .security-list li {
                color: #8b6914;
                font-size: 14px;
                margin-bottom: 10px;
                padding-left: 28px;
                position: relative;
                line-height: 1.5;
            }
            
            .security-list li::before {
                content: '✓';
                color: #059669;
                font-weight: bold;
                position: absolute;
                left: 0;
                font-size: 16px;
            }
            
            /* Enlace de respaldo profesional */
            .link-section {
                margin-top: 32px;
                padding-top: 32px;
                border-top: 1px solid #e8e8e8;
            }
            
            .link-label {
                font-size: 14px;
                color: #6a6a6a;
                margin-bottom: 12px;
            }
            
            .link-fallback {
                word-break: break-all;
                background: #fafafa;
                border: 1px solid #e8e8e8;
                border-radius: 2px;
                padding: 16px;
                font-family: 'Courier New', Courier, monospace;
                font-size: 12px;
                color: #662d91;
                text-align: center;
                line-height: 1.6;
            }
            
            /* Divisor */
            .divider {
                height: 1px;
                background: #e8e8e8;
                margin: 32px 0;
            }
            
            /* Footer corporativo */
            .footer {
                background: #1a1a1a;
                color: #ffffff;
                padding: 40px;
                text-align: center;
            }
            
            .footer-brand {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
            }
            
            .footer-logo {
                width: 32px;
                height: 32px;
                background: #662d91;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-right: 12px;
                font-size: 16px;
            }
            
            .footer-name {
                font-size: 18px;
                font-weight: 600;
                color: #ffffff;
            }
            
            .footer-tagline {
                font-size: 13px;
                color: #b0b0b0;
                margin-bottom: 24px;
            }
            
            .footer-divider {
                height: 1px;
                background: rgba(255, 255, 255, 0.1);
                margin: 24px 0;
            }
            
            .footer-legal {
                font-size: 12px;
                color: #808080;
                line-height: 1.6;
            }
            
            .footer-year {
                color: #b0b0b0;
                font-weight: 600;
            }
            
            /* Responsive */
            @media only screen and (max-width: 600px) {
                .email-wrapper {
                    padding: 20px 10px;
                }
                
                .header {
                    padding: 32px 24px;
                }
                
                .header h1 {
                    font-size: 24px;
                }
                
                .content {
                    padding: 32px 24px;
                }
                
                .info-grid {
                    display: block;
                }
                
                .info-item {
                    display: block;
                    width: 100%;
                    margin-bottom: 12px;
                }
                
                .reset-button {
                    padding: 14px 32px;
                    font-size: 14px;
                }
                
                .footer {
                    padding: 32px 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="email-container">
                <!-- Header -->
                <div class="header">
                    <div class="logo-container">
                        <div class="logo">🔐</div>
                    </div>
                    <h1>Recuperación de Contraseña</h1>
                    <div class="header-subtitle">Sistema de Tickets DuvyClass</div>
                </div>
                
                <!-- Contenido principal -->
                <div class="content">
                    <div class="greeting">
                        Hola, <span class="greeting-name">${userName}</span>
                    </div>
                    
                    <div class="message">
                        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el <strong>Sistema de Tickets DuvyClass</strong>.
                    </div>
                    
                    <div class="highlight-box">
                        <div class="highlight-title">Acción Requerida</div>
                        <div class="highlight-text">
                            Para continuar con el proceso de recuperación, haz clic en el botón de abajo y sigue las instrucciones para crear una nueva contraseña segura.
                        </div>
                    </div>
                    
                    <div class="cta-container">
                        <a href="${resetUrl}" class="reset-button">
                            RESTABLECER CONTRASEÑA
                        </a>
                    </div>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-icon">⏱️</span>
                            <div class="info-title">Válido por</div>
                            <div class="info-text">1 hora desde la solicitud</div>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">🔒</span>
                            <div class="info-title">Seguridad</div>
                            <div class="info-text">Enlace de un solo uso</div>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">✓</span>
                            <div class="info-title">Sin problemas</div>
                            <div class="info-text">Puedes ignorar este email</div>
                        </div>
                    </div>
                    
                    <div class="security-box">
                        <div class="security-header">
                            <span class="security-icon">🛡️</span>
                            <h3 class="security-title">Medidas de Seguridad</h3>
                        </div>
                        <div class="security-text">
                            Para proteger tu cuenta, ten en cuenta lo siguiente:
                        </div>
                        <ul class="security-list">
                            <li>Este enlace expirará automáticamente después de 1 hora</li>
                            <li>Si no realizaste esta solicitud, tu contraseña actual permanece segura</li>
                            <li>No compartas este enlace con terceros</li>
                            <li>El enlace solo puede utilizarse una vez</li>
                        </ul>
                    </div>
                    
                    <div class="link-section">
                        <div class="link-label">
                            <strong>¿Problemas con el botón?</strong> Copia y pega este enlace en tu navegador:
                        </div>
                        <div class="link-fallback">
                            ${resetUrl}
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <div class="footer-brand">
                        <div class="footer-logo">📋</div>
                        <div class="footer-name">DuvyClass</div>
                    </div>
                    <div class="footer-tagline">Sistema de Gestión de Tickets y Soporte Técnico</div>
                    <div class="footer-divider"></div>
                    <div class="footer-legal">
                        <span class="footer-year">© ${currentYear}</span> DuvyClass. Todos los derechos reservados.<br>
                        Este es un mensaje automático del sistema. Por favor, no responda a este correo.
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Verificar configuración de MailerSend
   * @returns {Object} - Estado de la configuración
   */
  checkConfiguration() {
    const apiKey = process.env.SENDGRID_API_KEY; // Reutilizamos la variable para el token de MailerSend
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@test-xkjn41m1e954z781.mlsender.net';
    const fromName = process.env.SENDGRID_FROM_NAME || 'Sistema de Tickets DuvyClass';
    
    const issues = [];
    
    if (!apiKey) {
      issues.push('SENDGRID_API_KEY (MailerSend token) no está configurada');
    }
    
    if (!fromEmail) {
      issues.push('SENDGRID_FROM_EMAIL no está configurada');
    }
    
    if (!fromName) {
      issues.push('SENDGRID_FROM_NAME no está configurada');
    }
    
    return {
      isConfigured: issues.length === 0,
      issues: issues,
      hasApiKey: !!apiKey,
      hasFromEmail: !!fromEmail,
      hasFromName: !!fromName,
      service: 'MailerSend'
    };
  }
}

module.exports = new EmailService();