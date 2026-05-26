import { Resend } from 'resend';
import { EmailOptions } from '../types/email.types';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  static async send(options: EmailOptions): Promise<void> {
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
