import { MeetEmailData } from '../types/email.types';

export function renderMeetEmail(data: MeetEmailData): string {
  return `
    <div style="font-family: monospace; background-color: #0A0A0A; color: #F4F4F5; padding: 40px; border: 1px solid #C9A96E;">
      <h1 style="color: #C9A96E; font-weight: normal; font-size: 20px; border-bottom: 1px solid rgba(201,169,110,0.15); padding-bottom: 20px;">F A B R I C</h1>
      <p>Hola ${data.name},</p>
      <p>Se ha generado el enlace para tu sesión de diagnóstico técnico:</p>
      <div style="background-color: #141414; border: 1px solid rgba(201, 169, 110, 0.3); padding: 20px; margin: 20px 0;">
        <div>Fecha: <strong>${data.date}</strong></div>
        <div>Hora: <strong>${data.timeSlot}</strong></div>
        <div>Enlace de Google Meet: <a href="${data.meetLink}" style="color: #C9A96E; text-decoration: underline;">${data.meetLink}</a></div>
      </div>
      <p>Este es un canal de comunicación de alta prioridad para la remediación de arquitectura Oracle.</p>
      <p style="color: #888; font-size: 11px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
        FABRIC Engine · Oracle Critical Engineering
      </p>
    </div>
  `;
}

export function renderMeetEmailText(data: MeetEmailData): string {
  return `
    F A B R I C
    
    Hola ${data.name},
    
    Se ha generado el enlace para tu sesión de diagnóstico técnico:
    
    Fecha: ${data.date}
    Hora: ${data.timeSlot}
    Enlace de Google Meet: ${data.meetLink}
    
    Este es un canal de comunicación de alta prioridad para la remediación de arquitectura Oracle.
    
    FABRIC Engine · Oracle Critical Engineering
  `;
}
