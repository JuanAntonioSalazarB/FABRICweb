"use server";

import { connectToDatabase } from '@/lib/mongodb';
import { Lead, Assessment, Booking, Settings, DoctrineLead, EvidenceRequest, AvailableSlot } from '@/lib/models';
import { Resend } from 'resend';

declare global {
  var mockAvailableSlots: any[] | undefined;
  var mockBookings: any[] | undefined;
}


const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Helper to send notifications to Slack if webhook is configured
async function dispatchSlackNotification(text: string) {
  try {
    const settings = await Settings.findOne();
    if (settings && settings.slackWebhook && settings.slackWebhook.trim() !== '') {
      await fetch(settings.slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      console.log('Slack notification dispatched successfully');
    }
  } catch (err) {
    console.error('Failed to dispatch Slack notification:', err);
  }
}


// Server Action for waitlist submission
export async function submitWaitlistAction(data: {
  name: string;
  email: string;
  company: string;
  role: string;
  scenario: string;
}) {
  try {
    const conn = await connectToDatabase();
    
    let leadId = null;
    if (conn) {
      const newLead = new Lead(data);
      const saved = await newLead.save();
      leadId = saved._id.toString();
    } else {
      console.log('MongoDB not configured. Mocking waitlist save:', data);
    }

    // Attempt to send email via Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: 'admissions@fabric.engine <onboarding@resend.dev>',
          to: data.email,
          subject: 'Solicitud de Admisión Registrada · FABRIC',
          html: `
            <div style="font-family: monospace; background-color: #0A0A0A; color: #F4F4F5; padding: 40px; border: 1px solid #C9A96E;">
              <h1 style="color: #C9A96E; font-weight: normal; font-size: 20px; border-bottom: 1px solid rgba(201,169,110,0.15); padding-bottom: 20px;">F A B R I C</h1>
              <p>Estimado/a ${data.name},</p>
              <p>Hemos registrado tu solicitud de admisión para el escenario de <strong>${data.scenario === 'rescue' ? 'Rescate Fusion' : data.scenario === 'migration' ? 'Migración Legacy' : 'Implementación Greenfield'}</strong> en <strong>${data.company}</strong>.</p>
              <p>Nuestra mesa técnica evaluará tu caso y se pondrá en contacto contigo en las próximas 24 horas.</p>
              <p style="color: #888; font-size: 11px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
                FABRIC Engine · Oracle Critical Engineering
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error('Failed to send Resend email:', err);
      }
    } else {
      console.log('Resend API key not configured. Mocking email send.');
    }

    // Dispatch Slack Notification
    const scenarioName = data.scenario === 'rescue' ? 'Rescate Fusion' : data.scenario === 'migration' ? 'Migración Legacy' : 'Implementación Greenfield';
    await dispatchSlackNotification(`*Nueva Solicitud de Admisión (Waitlist) · FABRIC*\n• *Cliente:* ${data.name}\n• *Compañía:* ${data.company}\n• *Puesto:* ${data.role}\n• *Escenario:* ${scenarioName}`);

    return { success: true, leadId };
  } catch (error: any) {
    console.error('Error in submitWaitlistAction:', error);
    return { success: false, error: error.message };
  }
}

// Server Action for Assessment submission
export async function submitAssessmentAction(data: {
  name: string;
  email: string;
  company: string;
  role: string;
  answers: number[];
  score: number;
  riskLevel: string;
}) {
  try {
    const conn = await connectToDatabase();
    
    if (conn) {
      const newAssessment = new Assessment(data);
      await newAssessment.save();
    } else {
      console.log('MongoDB not configured. Mocking assessment save:', data);
    }

    if (resend) {
      try {
        await resend.emails.send({
          from: 'diagnostics@fabric.engine <onboarding@resend.dev>',
          to: data.email,
          subject: 'Resultado del Diagnóstico de Riesgo Oracle · FABRIC',
          html: `
            <div style="font-family: monospace; background-color: #0A0A0A; color: #F4F4F5; padding: 40px; border: 1px solid #C9A96E;">
              <h1 style="color: #C9A96E; font-weight: normal; font-size: 20px; border-bottom: 1px solid rgba(201,169,110,0.15); padding-bottom: 20px;">F A B R I C</h1>
              <p>Estimado/a ${data.name},</p>
              <p>Tu diagnóstico de riesgo para <strong>${data.company}</strong> ha sido procesado.</p>
              <div style="background-color: #141414; border: 1px solid rgba(251, 191, 36, 0.3); padding: 20px; margin: 20px 0;">
                <span style="color: #C9A96E; font-weight: bold; display: block; margin-bottom: 10px;">Diagnóstico:</span>
                <div>Puntuación total: <strong>${data.score} / 36 puntos</strong></div>
                <div>Nivel de Riesgo Operativo: <strong style="color: ${data.score > 20 ? '#EF4444' : data.score > 9 ? '#F59E0B' : '#10B981'}">${data.riskLevel}</strong></div>
              </div>
              <p>Nuestros ingenieros seniors están analizando tus respuestas para preparar una propuesta de remediación a la medida.</p>
              <p style="color: #888; font-size: 11px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
                FABRIC Engine · Oracle Critical Engineering
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error('Failed to send Resend email:', err);
      }
    }

    // Dispatch Slack Notification
    await dispatchSlackNotification(`*Nuevo Diagnóstico de Riesgo Completado · FABRIC*\n• *Compañía:* ${data.company}\n• *Cliente:* ${data.name} (${data.role})\n• *Puntuación:* ${data.score} / 12 puntos\n• *Nivel de Riesgo:* ${data.riskLevel}`);

    return { success: true };
  } catch (error: any) {
    console.error('Error in submitAssessmentAction:', error);
    return { success: false, error: error.message };
  }
}

// Action to get unbooked available slots
export async function getAvailableSlotsAction() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const slots = await AvailableSlot.find({ isBooked: false }).sort({ date: 1, timeSlot: 1 });
      return { success: true, slots: JSON.parse(JSON.stringify(slots)) };
    } else {
      // Fallback in-memory slots if database is not configured
      if (!global.mockAvailableSlots) {
        // Create 5 business days with some default slots
        const dates: string[] = [];
        let d = new Date();
        while (dates.length < 5) {
          d.setDate(d.getDate() + 1);
          if (d.getDay() !== 0 && d.getDay() !== 6) {
            dates.push(d.toISOString().split('T')[0]);
          }
        }
        global.mockAvailableSlots = [
          { _id: 'mock-1', date: dates[0], timeSlot: '09:00 AM CST', isBooked: false },
          { _id: 'mock-2', date: dates[0], timeSlot: '02:00 PM CST', isBooked: false },
          { _id: 'mock-3', date: dates[1], timeSlot: '11:00 AM CST', isBooked: false },
          { _id: 'mock-4', date: dates[2], timeSlot: '04:00 PM CST', isBooked: false },
        ];
      }
      const available = global.mockAvailableSlots.filter((s: any) => !s.isBooked);
      return { success: true, slots: available };
    }
  } catch (error: any) {
    console.error("Error in getAvailableSlotsAction:", error);
    return { success: false, slots: [], error: error.message };
  }
}

// Server Action for Booking office hours
export async function bookOfficeHoursAction(data: {
  name: string;
  email: string;
  company: string;
  role: string;
  date: string;
  timeSlot: string;
}) {
  try {
    const conn = await connectToDatabase();
    
    if (conn) {
      // 1. Find the slot and mark it booked
      const slot = await AvailableSlot.findOne({ date: data.date, timeSlot: data.timeSlot });
      if (!slot) {
        return { success: false, error: 'El horario seleccionado no está disponible.' };
      }
      if (slot.isBooked) {
        return { success: false, error: 'El horario ya está reservado.' };
      }
      
      slot.isBooked = true;
      await slot.save();

      // 2. Create the Booking document
      const newBooking = new Booking(data);
      await newBooking.save();
    } else {
      console.log('MongoDB not configured. Mocking booking save and slot booking:', data);
      if (global.mockAvailableSlots) {
        const slot = global.mockAvailableSlots.find(
          (s: any) => s.date === data.date && s.timeSlot === data.timeSlot
        );
        if (!slot) {
          return { success: false, error: 'El horario seleccionado no está disponible (mock).' };
        }
        if (slot.isBooked) {
          return { success: false, error: 'El horario ya está reservado (mock).' };
        }
        slot.isBooked = true;
      }
      
      // Save mock booking in the global cache so the dashboard displays it
      if (!global.mockBookings) {
        global.mockBookings = [
          { _id: '1', name: 'María Gómez', email: 'maria@retailcorp.com', company: 'Retail Corp', role: 'IT Manager', date: '2026-05-24', timeSlot: '11:00 AM CST', createdAt: new Date() }
        ];
      }
      global.mockBookings.push({
        _id: 'mock-booking-' + Date.now(),
        ...data,
        createdAt: new Date()
      });
    }

    if (resend) {
      try {
        await resend.emails.send({
          from: 'officehours@fabric.engine <onboarding@resend.dev>',
          to: data.email,
          subject: 'Confirmación de Sesión de Diagnóstico 1-on-1 · FABRIC',
          html: `
            <div style="font-family: monospace; background-color: #0A0A0A; color: #F4F4F5; padding: 40px; border: 1px solid #C9A96E;">
              <h1 style="color: #C9A96E; font-weight: normal; font-size: 20px; border-bottom: 1px solid rgba(201,169,110,0.15); padding-bottom: 20px;">F A B R I C</h1>
              <p>Hola ${data.name},</p>
              <p>Tu sesión de diagnóstico técnico con el equipo senior de FABRIC ha sido reservada.</p>
              <div style="background-color: #141414; border: 1px solid rgba(201, 169, 110, 0.3); padding: 20px; margin: 20px 0;">
                <div>Fecha: <strong>${data.date}</strong></div>
                <div>Hora: <strong>${data.timeSlot} CST</strong></div>
                <div>Plataforma: <strong>Google Meet (Enlace en invitación de calendario)</strong></div>
              </div>
              <p>Te hemos enviado la invitación de calendario formal con el Acuerdo NDA preliminar adjunto.</p>
              <p style="color: #888; font-size: 11px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
                FABRIC Engine · Oracle Critical Engineering
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error('Failed to send Resend email:', err);
      }
    }

    // Dispatch Slack Notification
    await dispatchSlackNotification(`*Nueva Sesión Técnico Agendada · FABRIC*\n• *Cliente:* ${data.name} (${data.company})\n• *Fecha:* ${data.date}\n• *Horario:* ${data.timeSlot} CST`);

    return { success: true };
  } catch (error: any) {
    console.error('Error in bookOfficeHoursAction:', error);
    return { success: false, error: error.message };
  }
}


// Server Action for Doctrine Generator submission
export async function submitDoctrineLeadAction(data: {
  name: string;
  email: string;
  company: string;
  role: string;
  answers: {
    projectType: string;
    industry: string;
    revenue: string;
    timeline: string;
    concerns: string[];
    roleInProject: string;
  };
}) {
  try {
    const conn = await connectToDatabase();
    
    let leadId = null;
    if (conn) {
      const newLead = new DoctrineLead(data);
      const saved = await newLead.save();
      leadId = saved._id.toString();
    } else {
      console.log('MongoDB not configured. Mocking doctrine lead save:', data);
    }

    // Dispatch Slack Notification
    const concernsText = data.answers.concerns.join(', ');
    await dispatchSlackNotification(
      `*Nuevo Lead de Cláusulas Contractuales (Doctrine Generator) · FABRIC*\n` +
      `• *Cliente:* ${data.name}\n` +
      `• *Compañía:* ${data.company}\n` +
      `• *Puesto:* ${data.role}\n` +
      `• *Proyecto:* ${data.answers.projectType}\n` +
      `• *Industria:* ${data.answers.industry}\n` +
      `• *Ingresos:* ${data.answers.revenue}\n` +
      `• *Inicio:* ${data.answers.timeline}\n` +
      `• *Preocupaciones:* ${concernsText}\n` +
      `• *Rol en Proyecto:* ${data.answers.roleInProject}`
    );

    // Attempt to send email via Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: 'doctrina@fabric.engine <onboarding@resend.dev>',
          to: data.email,
          subject: 'Cláusulas Contractuales Recomendadas · FABRIC',
          html: `
            <div style="font-family: monospace; background-color: #0A0A0A; color: #F4F4F5; padding: 40px; border: 1px solid #C9A96E;">
              <h1 style="color: #C9A96E; font-weight: normal; font-size: 20px; border-bottom: 1px solid rgba(201,169,110,0.15); padding-bottom: 20px;">F A B R I C</h1>
              <p>Estimado/a ${data.name},</p>
              <p>Hemos procesado sus respuestas en el Generador de Doctrina de FABRIC para <strong>${data.company}</strong>.</p>
              <p>A continuación se anexan las cláusulas clave según sus preocupaciones principales (${concernsText}):</p>
              <div style="background-color: #141414; border: 1px solid rgba(201, 169, 110, 0.3); padding: 20px; margin: 20px 0;">
                <span style="color: #C9A96E; font-weight: bold; display: block; margin-bottom: 10px;">Cláusulas de Ingeniería Crítica:</span>
                <p>Las cláusulas contractuales han sido generadas. Puede imprimirlas directamente como reporte PDF en nuestro sitio web.</p>
              </div>
              <p>Nuestra mesa de ingeniería queda a su disposición para evaluar y auditar cualquier contrato de consultoría Oracle en curso.</p>
              <p style="color: #888; font-size: 11px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
                FABRIC Engine · Oracle Critical Engineering
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error('Failed to send Resend email:', err);
      }
    }

    return { success: true, leadId };
  } catch (error: any) {
    console.error('Error in submitDoctrineLeadAction:', error);
    return { success: false, error: error.message };
  }
}

// Server Action for Evidence and Gated Paper requests
export async function submitEvidenceRequestAction(data: {
  name: string;
  email: string;
  company: string;
  role: string;
  docName: string;
  type: 'evidence' | 'paper';
  caseId?: string;
  ndaAccepted: boolean;
}) {
  try {
    const conn = await connectToDatabase();
    
    let requestId = null;
    if (conn) {
      const newRequest = new EvidenceRequest(data);
      const saved = await newRequest.save();
      requestId = saved._id.toString();
    } else {
      console.log('MongoDB not configured. Mocking evidence request save:', data);
    }

    // Send notifications to Slack
    const typeLabel = data.type === 'evidence' ? 'Solicitud de Evidencia bajo NDA' : 'Descarga de Paper Técnico (Gated)';
    const caseLabel = data.caseId ? `\n• *Caso/Contexto:* ${data.caseId}` : '';
    await dispatchSlackNotification(
      `*${typeLabel} · FABRIC*\n` +
      `• *Cliente:* ${data.name}\n` +
      `• *Email:* ${data.email}\n` +
      `• *Compañía:* ${data.company}\n` +
      `• *Puesto:* ${data.role}\n` +
      `• *Documento:* ${data.docName}\n` +
      `• *NDA Aceptado:* ${data.ndaAccepted ? 'Sí' : 'No'}${caseLabel}`
    );

    // Attempt to send email via Resend
    if (resend) {
      try {
        const subject = data.type === 'evidence'
          ? `Solicitud de Evidencia Autorizada · ${data.docName}`
          : `Descarga de Paper: ${data.docName} · FABRIC`;
        
        const mailContent = data.type === 'evidence'
          ? `<p>Estimado/a ${data.name},</p>
             <p>Hemos registrado su solicitud de evidencia confidencial para el documento: <strong>${data.docName}</strong>.</p>
             <p>Al haber aceptado el Acuerdo NDA de No Divulgación, nuestro oficial de seguridad evaluará y autorizará las llaves criptográficas del visor en las próximas horas.</p>`
          : `<p>Estimado/a ${data.name},</p>
             <p>Gracias por su interés en el paper técnico: <strong>${data.docName}</strong>.</p>
             <p>Su descarga está siendo autorizada y estará disponible en breves instantes.</p>`;

        await resend.emails.send({
          from: 'security@fabric.engine <onboarding@resend.dev>',
          to: data.email,
          subject: subject,
          html: `
            <div style="font-family: monospace; background-color: #0A0A0A; color: #F4F4F5; padding: 40px; border: 1px solid #C9A96E;">
              <h1 style="color: #C9A96E; font-weight: normal; font-size: 20px; border-bottom: 1px solid rgba(201,169,110,0.15); padding-bottom: 20px;">F A B R I C</h1>
              ${mailContent}
              <p style="color: #888; font-size: 11px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
                FABRIC Engine · Oracle Critical Engineering
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error('Failed to send Resend email:', err);
      }
    }

    return { success: true, requestId };
  } catch (error: any) {
    console.error('Error in submitEvidenceRequestAction:', error);
    return { success: false, error: error.message };
  }
}


