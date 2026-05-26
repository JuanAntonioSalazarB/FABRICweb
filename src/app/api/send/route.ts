import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son obligatorios.' },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (!gmailUser || !gmailPass) {
      return NextResponse.json(
        { success: false, error: 'Las credenciales SMTP de Gmail (GMAIL_USER / GMAIL_PASS) no están configuradas.' },
        { status: 500 }
      );
    }

    // Configure the Gmail SMTP Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Send mail option setup
    const mailOptions = {
      from: `"${name}" <${gmailUser}>`,
      to: gmailUser, // sends to the owner
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: message,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nuevo mensaje de formulario de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #eee;">${message}</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Correo enviado con éxito.'
    });
  } catch (error: any) {
    console.error('Error al enviar correo vía SMTP:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al enviar el correo.' },
      { status: 500 }
    );
  }
}
