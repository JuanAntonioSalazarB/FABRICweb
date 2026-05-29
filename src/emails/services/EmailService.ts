import { Resend } from 'resend';
import { EmailOptions } from '../types/email.types';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export class EmailService {
  static async send(options: EmailOptions): Promise<void> {
    if (!resend) {
      console.warn('Resend API Key is missing. Mocking email send:', options);
      return;
    }
    try {
      const { data, error } = await resend.emails.send({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      if (error) {
        console.error('Error de Resend:', error);
        throw new Error(`Error de Resend: ${error.message}`);
      }

      console.log('Email enviado vía Resend:', data?.id);
    } catch (error: any) {
      console.error('Error enviando email con Resend:', error);
      throw new Error(`No se pudo enviar el email: ${error.message}`);
    }
  }
}
