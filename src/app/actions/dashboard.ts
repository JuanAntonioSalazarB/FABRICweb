"use server";

import { connectToDatabase } from '@/lib/mongodb';
import { Lead, Assessment, Booking, Settings, SystemPrompt, LocalKnowledge, DoctrineLead, EvidenceRequest, AvailableSlot, SystemLog } from '@/lib/models';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

import { EmailService } from '@/emails/services/EmailService';
import { renderMeetEmail, renderMeetEmailText } from '@/emails/templates/MeetEmail';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

declare global {
  var mockAvailableSlots: any[] | undefined;
  var mockBookings: any[] | undefined;
  var mockLogs: any[] | undefined;
}


// Helper to check if database is connected
async function getDbConnection() {
  try {
    return await connectToDatabase();
  } catch (err) {
    console.warn("MongoDB connection failed in dashboard action:", err);
    return null;
  }
}

// 1. Resumen General Actions
export async function getDashboardStatsAction(rangeDays: number = 7) {
  try {
    const conn = await getDbConnection();
    
    if (!conn) {
      // Mock stats when database is not connected
      const mockDailyStats = [];
      const now = new Date();
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      
      for (let i = rangeDays - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dayLabel = rangeDays > 7 ? `${d.getDate()}/${d.getMonth() + 1}` : dayNames[d.getDay()];
        
        // Dynamic mock values mapped using mathematical curves to match the aesthetic of original data
        let factor = 1;
        if (i % 3 === 0) factor = 1.3;
        if (i % 5 === 0) factor = 0.7;
        if (i === 0) factor = 1.8;
        
        const leads = Math.round((4 + (i * 3) % 12) * factor);
        const assessments = Math.round((6 + (i * 4) % 18) * factor);
        const bookings = Math.round((2 + (i * 1.5) % 6) * factor);
        
        mockDailyStats.push({
          dateStr: d.toISOString().split('T')[0],
          label: dayLabel,
          leads,
          assessments,
          bookings,
          total: leads + assessments + bookings
        });
      }

      return {
        success: true,
        stats: {
          totalLeads: 48,
          totalAssessments: 64,
          totalBookings: 12,
          scenarios: { rescue: 22, migration: 18, greenfield: 8 },
          riskLevels: { high: 32, medium: 24, low: 8 },
          dailyStats: mockDailyStats,
          recentActivity: [
            { id: '1', type: 'lead', title: 'Nueva Admisión', subtitle: 'Juan Pérez (Tech Logistics)', time: 'Hace 5 minutos' },
            { id: '2', type: 'booking', title: 'Reunión Agendada', subtitle: 'María Gómez - 24/05/2026 11:00 AM', time: 'Hace 2 horas' },
            { id: '3', type: 'assessment', title: 'Diagnóstico Completado', subtitle: 'Finanzas Inc (Riesgo Alto)', time: 'Hace 4 horas' },
            { id: '4', type: 'lead', title: 'Nueva Admisión', subtitle: 'Carlos Slim (TeleCorp)', time: 'Ayer' }
          ]
        }
      };
    }

    const totalLeads = await Lead.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Aggregates for scenarios
    const rescueCount = await Lead.countDocuments({ scenario: 'rescue' });
    const migrationCount = await Lead.countDocuments({ scenario: 'migration' });
    const greenfieldCount = await Lead.countDocuments({ scenario: 'greenfield' });

    // Aggregates for risk levels
    const highRisk = await Assessment.countDocuments({ riskLevel: 'Alto / Remediación Crítica' });
    const mediumRisk = await Assessment.countDocuments({ riskLevel: 'Medio / Cuello de Botella' });
    const lowRisk = await Assessment.countDocuments({ riskLevel: 'Bajo' });

    // Calculate real historical stats for the requested N days
    const dailyStats = [];
    const now = new Date();
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      
      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);
      
      const dayLabel = rangeDays > 7 ? `${d.getDate()}/${d.getMonth() + 1}` : dayNames[d.getDay()];

      const leadsCount = await Lead.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
      const assessmentsCount = await Assessment.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
      const bookingsCount = await Booking.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } });

      dailyStats.push({
        dateStr: d.toISOString().split('T')[0],
        label: dayLabel,
        leads: leadsCount,
        assessments: assessmentsCount,
        bookings: bookingsCount,
        total: leadsCount + assessmentsCount + bookingsCount
      });
    }

    // Fetch recent activities
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(3);
    const recentAssessments = await Assessment.find().sort({ createdAt: -1 }).limit(3);
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(3);
    const recentDoctrine = await DoctrineLead.find().sort({ createdAt: -1 }).limit(3);
    const recentEvidence = await EvidenceRequest.find().sort({ createdAt: -1 }).limit(3);

    const activities: any[] = [];
    
    recentLeads.forEach(l => {
      activities.push({
        id: l._id.toString(),
        type: 'lead',
        title: 'Nueva Admisión',
        subtitle: `${l.name} (${l.company})`,
        date: l.createdAt
      });
    });

    recentAssessments.forEach(a => {
      activities.push({
        id: a._id.toString(),
        type: 'assessment',
        title: 'Diagnóstico Completado',
        subtitle: `${a.company} (Riesgo: ${a.riskLevel.split(' / ')[0]})`,
        date: a.createdAt
      });
    });

    recentBookings.forEach(b => {
      activities.push({
        id: b._id.toString(),
        type: 'booking',
        title: 'Reunión Agendada',
        subtitle: `${b.name} - ${b.date} ${b.timeSlot}`,
        date: b.createdAt
      });
    });

    recentDoctrine.forEach(d => {
      activities.push({
        id: d._id.toString(),
        type: 'doctrine',
        title: 'Doctrina Generada',
        subtitle: `${d.name} (${d.company})`,
        date: d.createdAt
      });
    });

    recentEvidence.forEach(e => {
      activities.push({
        id: e._id.toString(),
        type: e.type === 'evidence' ? 'evidence' : 'paper',
        title: e.type === 'evidence' ? 'Solicitud Evidencia NDA' : 'Descarga de Paper',
        subtitle: `${e.name} (${e.company}) - ${e.docName}`,
        date: e.createdAt
      });
    });

    // Sort combined activities by date descending
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const formattedActivities = activities.slice(0, 5).map(act => {
      const diffMs = new Date().getTime() - new Date(act.date).getTime();
      const diffMins = Math.round(diffMs / 60000);
      let timeText = 'Hace unos momentos';
      if (diffMins >= 60) {
        const diffHrs = Math.round(diffMins / 60);
        if (diffHrs >= 24) {
          timeText = `Hace ${Math.round(diffHrs / 24)} días`;
        } else {
          timeText = `Hace ${diffHrs} horas`;
        }
      } else if (diffMins > 0) {
        timeText = `Hace ${diffMins} minutos`;
      }
      return {
        id: act.id,
        type: act.type,
        title: act.title,
        subtitle: act.subtitle,
        time: timeText
      };
    });

    return {
      success: true,
      stats: {
        totalLeads,
        totalAssessments,
        totalBookings,
        scenarios: { rescue: rescueCount, migration: migrationCount, greenfield: greenfieldCount },
        riskLevels: { high: highRisk, medium: mediumRisk, low: lowRisk },
        dailyStats,
        recentActivity: formattedActivities
      }
    };
  } catch (error: any) {
    console.error("Error in getDashboardStatsAction:", error);
    return { success: false, error: error.message };
  }
}

// 2. Métricas de la Página Actions (Leads & Assessments list and delete)
export async function getLeadsAndAssessmentsAction() {
  try {
    const conn = await getDbConnection();
    if (!conn) {
      return {
        success: true,
        leads: [
          { _id: '1', name: 'Juan Pérez', email: 'juan@techlogistics.com', company: 'Tech Logistics', role: 'CTO', scenario: 'rescue', createdAt: new Date() },
          { _id: '2', name: 'Carlos Slim', email: 'carlos@telecorp.com', company: 'TeleCorp', role: 'CEO', scenario: 'migration', createdAt: new Date() }
        ],
        assessments: [
          { _id: '1', name: 'Finance Lead', email: 'test@finances.com', company: 'Finanzas Inc', role: 'CFO', score: 28, riskLevel: 'Alto / Remediación Crítica', answers: [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0], createdAt: new Date() }
        ],
        doctrineLeads: [
          { _id: 'd1', name: 'Ana Martínez', email: 'ana@retail.com', company: 'Retail Global', role: 'Legal Director', answers: { projectType: 'SaaS Integration', industry: 'Retail', revenue: 'USD 50M+', timeline: '1-3 meses', concerns: ['SLA Compliance', 'Data Residency'], roleInProject: 'Legal Advisory' }, createdAt: new Date() }
        ],
        evidenceRequests: [
          { _id: 'e1', name: 'Pedro Domínguez', email: 'pedro@bank.com', company: 'Bank Latino', role: 'Compliance Officer', docName: 'Evidencia APE Plazas NDA', type: 'evidence', caseId: 'ape', ndaAccepted: true, createdAt: new Date() },
          { _id: 'e2', name: 'Sofía Castro', email: 'sofia@telco.com', company: 'Telco Global', role: 'VP of Tech', docName: 'Whitepaper Oracle Migrations', type: 'paper', ndaAccepted: false, createdAt: new Date() }
        ]
      };
    }

    const leads = await Lead.find().sort({ createdAt: -1 });
    const assessments = await Assessment.find().sort({ createdAt: -1 });
    const doctrineLeads = await DoctrineLead.find().sort({ createdAt: -1 });
    const evidenceRequests = await EvidenceRequest.find().sort({ createdAt: -1 });

    return {
      success: true,
      leads: JSON.parse(JSON.stringify(leads)),
      assessments: JSON.parse(JSON.stringify(assessments)),
      doctrineLeads: JSON.parse(JSON.stringify(doctrineLeads)),
      evidenceRequests: JSON.parse(JSON.stringify(evidenceRequests))
    };
  } catch (error: any) {
    console.error("Error in getLeadsAndAssessmentsAction:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLeadAction(id: string) {
  try {
    const conn = await getDbConnection();
    if (conn) {
      await Lead.findByIdAndDelete(id);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAssessmentAction(id: string) {
  try {
    const conn = await getDbConnection();
    if (conn) {
      await Assessment.findByIdAndDelete(id);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDoctrineLeadAction(id: string) {
  try {
    const conn = await getDbConnection();
    if (conn) {
      await DoctrineLead.findByIdAndDelete(id);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEvidenceRequestAction(id: string) {
  try {
    const conn = await getDbConnection();
    if (conn) {
      await EvidenceRequest.findByIdAndDelete(id);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 3. Reuniones Agendadas Actions (Bookings list and cancel)
export async function getBookingsAction() {
  try {
    const conn = await getDbConnection();
    if (!conn) {
      if (!global.mockBookings) {
        global.mockBookings = [
          { _id: '1', name: 'María Gómez', email: 'maria@retailcorp.com', company: 'Retail Corp', role: 'IT Manager', date: '2026-05-24', timeSlot: '11:00 AM CST', createdAt: new Date() }
        ];
      }
      return {
        success: true,
        bookings: global.mockBookings
      };
    }

    const bookings = await Booking.find().sort({ date: 1, timeSlot: 1 });
    return {
      success: true,
      bookings: JSON.parse(JSON.stringify(bookings))
    };
  } catch (error: any) {
    console.error("Error in getBookingsAction:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteBookingAction(id: string) {
  try {
    const conn = await getDbConnection();
    if (conn) {
      // Find booking first to free up the slot
      const booking = await Booking.findById(id);
      if (booking) {
        await AvailableSlot.findOneAndUpdate(
          { date: booking.date, timeSlot: booking.timeSlot },
          { isBooked: false }
        );
      }
      await Booking.findByIdAndDelete(id);
    } else {
      if (global.mockBookings) {
        const booking = global.mockBookings.find((b: any) => b._id === id);
        if (booking && global.mockAvailableSlots) {
          const slot = global.mockAvailableSlots.find(
            (s: any) => s.date === booking.date && s.timeSlot === booking.timeSlot
          );
          if (slot) {
            slot.isBooked = false;
          }
        }
        global.mockBookings = global.mockBookings.filter((b: any) => b._id !== id);
      }
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteBookingAction:", error);
    return { success: false, error: error.message };
  }
}

export async function sendMeetEmailAction(bookingId: string, meetLink: string): Promise<{ success: boolean; message?: string; warning?: string; error?: string }> {
  try {
    const conn = await getDbConnection();
    let booking: any;

    if (conn) {
      booking = await Booking.findById(bookingId);
    } else {
      if (global.mockBookings) {
        booking = global.mockBookings.find((b: any) => b._id === bookingId);
      }
    }

    if (!booking) {
      return { success: false, error: 'Reunión no encontrada.' };
    }

    const clientEmail = booking.email;
    const adminEmail = 'antonio.salazar@fabricsoft.com.mx';

    console.log(`[Resend Mailer] Procesando envío de Meet para: ${booking.name}, destinatario: ${clientEmail}`);

    try {
      const emailData = {
        name: booking.name,
        date: booking.date,
        timeSlot: booking.timeSlot,
        meetLink: meetLink
      };

      // Nota: onboarding@resend.dev solo permite enviar correos al dueño de la cuenta de Resend.
      // Si el clientEmail no es el dueño, fallará a menos que se use un dominio verificado.
      await EmailService.send({
        from: 'FABRIC <onboarding@resend.dev>',
        to: 'correo resend', //clientEmail, // Enviamos solo al cliente por ahora para evitar bloqueos de Resend sandbox
        subject: 'Enlace de Google Meet · FABRIC',
        text: renderMeetEmailText(emailData),
        html: renderMeetEmail(emailData),
      });

      await createSystemLog('success', 'email', `Enlace de Google Meet enviado con éxito a ${booking.name} vía Resend`, { meetLink, recipient: clientEmail });
      
      return { 
        success: true, 
        message: 'Enlace de Meet enviado con éxito vía Resend.' 
      };
    } catch (emailErr: any) {
      console.error("Error al enviar correo:", emailErr);
      await createSystemLog('error', 'email', `Fallo al enviar correo a ${clientEmail}: ${emailErr.message}`);
      return { success: false, error: `Error al enviar correo: ${emailErr.message}` };
    }
  } catch (error: any) {
    console.error("Error in sendMeetEmailAction:", error);
    return { success: false, error: error.message };
  }
}

const DEFAULT_REFERENCES_CONSENT = [
  { id: 'ref-1', name: 'CFO APE Plazas', title: 'CFO de operadora de centros comerciales', company: 'APE Plazas', consentStatus: 'confirmed', lastValidated: '2026-05-15', method: 'personal', subtitle: 'Industria: Inmobiliaria / Centros Comerciales (LATAM)', context: 'Estabilización de reportabilidad contable, conciliación de arrendamientos y cierres multimoneda.', iconName: 'building' },
  { id: 'ref-2', name: 'CTO ABC Capital', title: 'CTO de institución financiera', company: 'ABC Capital', consentStatus: 'confirmed', lastValidated: '2026-05-16', method: 'personal', subtitle: 'Volumen: USD 300M+ Revenue Anual', context: 'Integraciones críticas de core bancario con Oracle ERP, automatización de pólizas contables masivas.', iconName: 'landmark' },
  { id: 'ref-3', name: 'CFO Controller Aplazo', title: 'CFO Controller de fintech regulada', company: 'Aplazo', consentStatus: 'confirmed', lastValidated: '2026-05-15', method: 'personal', subtitle: 'Industria: Fintech / Regulación Financiera', context: 'Auditoría y remediación de procesos de consolidación fiscal en Fusion Cloud, reportes normativos automatizados.', iconName: 'wallet' },
  { id: 'ref-4', name: 'CISO/CTO Provident', title: 'CISO/CTO de fintech de crédito al consumo', company: 'Provident', consentStatus: 'confirmed', lastValidated: '2026-05-18', method: 'personal', subtitle: 'Área: Seguridad e Integraciones Financieras', context: 'Seguridad de accesos, flujos de conciliación automatizada de cobranza e integraciones con pasarelas de pago.', iconName: 'users' },
  { id: 'ref-5', name: 'Roberto Hernandez', title: 'Director de Consultoría de Oracle ACS', company: 'Oracle ACS', consentStatus: 'confirmed', lastValidated: '2026-05-20', method: 'personal', subtitle: 'Especialidad: Ecosistema Oracle Services', context: 'Perspectiva externa sobre metodologías de estabilización e ingeniería avanzada en remediación de proyectos Fusion.', iconName: 'award' }
];

// 4. Configuración de IA Actions (Settings save & load)
export async function getSettingsAction() {
  try {
    const conn = await getDbConnection();
    if (!conn || !conn.connection || !conn.connection.db) {
      return {
        success: true,
        settings: {
          systemPrompt: '',
          localKnowledge: '',
          openaiModel: 'gpt-4o',
          temperature: 0.1,
          slackWebhook: '',
          referencesConsent: DEFAULT_REFERENCES_CONSENT
        },
        dbVerification: {
          connected: false,
          collectionsVerified: false,
          collectionsCreated: []
        }
      };
    }

    // 1. Check & Create Tables/Collections if they don't exist
    const collections = await conn.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    const collectionsCreated: string[] = [];

    if (!collectionNames.includes('systemprompts')) {
      await conn.connection.db.createCollection('systemprompts');
      collectionsCreated.push('systemprompts');
      console.log('Collection systemprompts created successfully.');
    }
    if (!collectionNames.includes('localknowledges')) {
      await conn.connection.db.createCollection('localknowledges');
      collectionsCreated.push('localknowledges');
      console.log('Collection localknowledges created successfully.');
    }

    // 2. Load latest values from their respective tables
    let sysPromptDoc = await SystemPrompt.findOne().sort({ updatedAt: -1 });
    let localKnowledgeDoc = await LocalKnowledge.findOne().sort({ updatedAt: -1 });
    let settings = await Settings.findOne();

    // Migration / Fallback logic:
    // If the collections were just created or are empty, check if settings contains them and migrate
    if (!sysPromptDoc && settings?.systemPrompt) {
      sysPromptDoc = new SystemPrompt({ content: settings.systemPrompt });
      await sysPromptDoc.save();
    }
    if (!localKnowledgeDoc && settings?.localKnowledge) {
      localKnowledgeDoc = new LocalKnowledge({ content: settings.localKnowledge });
      await localKnowledgeDoc.save();
    }

    const systemPromptValue = sysPromptDoc ? sysPromptDoc.content : (settings?.systemPrompt || '');
    const localKnowledgeValue = localKnowledgeDoc ? localKnowledgeDoc.content : (settings?.localKnowledge || '');

    if (!settings) {
      return {
        success: true,
        settings: {
          systemPrompt: systemPromptValue,
          localKnowledge: localKnowledgeValue,
          openaiModel: 'gpt-4o',
          temperature: 0.1,
          slackWebhook: '',
          referencesConsent: DEFAULT_REFERENCES_CONSENT
        },
        dbVerification: {
          connected: true,
          collectionsVerified: true,
          collectionsCreated
        }
      };
    }

    return {
      success: true,
      settings: {
        systemPrompt: systemPromptValue,
        localKnowledge: localKnowledgeValue,
        openaiModel: settings.openaiModel || 'gpt-4o',
        temperature: settings.temperature !== undefined ? settings.temperature : 0.1,
        slackWebhook: settings.slackWebhook || '',
        referencesConsent: settings.referencesConsent && settings.referencesConsent.length > 0 ? settings.referencesConsent : DEFAULT_REFERENCES_CONSENT
      },
      dbVerification: {
        connected: true,
        collectionsVerified: true,
        collectionsCreated
      }
    };
  } catch (error: any) {
    console.error("Error in getSettingsAction:", error);
    return { success: false, error: error.message };
  }
}

export async function saveSettingsAction(data: {
  systemPrompt: string;
  localKnowledge: string;
  openaiModel: string;
  temperature: number;
  slackWebhook: string;
  referencesConsent?: any[];
}) {
  try {
    const conn = await getDbConnection();
    if (conn) {
      // Save to SystemPrompt collection (dedicated table)
      await SystemPrompt.findOneAndUpdate(
        {},
        { content: data.systemPrompt, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      // Save to LocalKnowledge collection (dedicated table)
      await LocalKnowledge.findOneAndUpdate(
        {},
        { content: data.localKnowledge || '', updatedAt: new Date() },
        { upsert: true, new: true }
      );

      // Also update the main Settings document
      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings(data);
      } else {
        settings.systemPrompt = data.systemPrompt;
        settings.localKnowledge = data.localKnowledge || '';
        settings.openaiModel = data.openaiModel;
        settings.temperature = data.temperature;
        settings.slackWebhook = data.slackWebhook;
        if (data.referencesConsent) {
          settings.referencesConsent = data.referencesConsent;
        }
        settings.updatedAt = new Date();
      }
      await settings.save();
    } else {
      console.log('MongoDB not configured. Mocking settings save:', data);
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error in saveSettingsAction:", error);
    return { success: false, error: error.message };
  }
}

export async function getPublicReferencesConsentAction() {
  try {
    const conn = await getDbConnection();
    let referencesConsent = DEFAULT_REFERENCES_CONSENT;
    
    if (conn) {
      const settings = await Settings.findOne();
      if (settings && settings.referencesConsent && settings.referencesConsent.length > 0) {
        referencesConsent = settings.referencesConsent;
      }
    }
    
    // Anonymize the references for public view - only return public fields
    // Real name and real company name are stripped/removed for GDPR / Client privacy protection!
    const publicConsent = referencesConsent.map(ref => ({
      id: ref.id,
      title: ref.title,
      consentStatus: ref.consentStatus,
      lastValidated: ref.lastValidated,
      method: ref.method,
      subtitle: ref.subtitle || 'Soporte Especializado Oracle',
      context: ref.context || 'Soporte de ingeniería crítica para sistemas core Oracle.',
      iconName: ref.iconName || 'building'
    }));
    
    return {
      success: true,
      references: publicConsent
    };
  } catch (error: any) {
    console.error("Error in getPublicReferencesConsentAction:", error);
    // fallback to default anonymized
    const publicConsent = DEFAULT_REFERENCES_CONSENT.map(ref => ({
      id: ref.id,
      title: ref.title,
      consentStatus: ref.consentStatus,
      lastValidated: ref.lastValidated,
      method: ref.method,
      subtitle: ref.subtitle || 'Soporte Especializado Oracle',
      context: ref.context || 'Soporte de ingeniería crítica para sistemas core Oracle.',
      iconName: ref.iconName || 'building'
    }));
    return { success: true, references: publicConsent };
  }
}

// Helper Action to check integrations status
export async function checkIntegrationsAction() {
  try {
    // 1. Active MongoDB Check
    let mongodbStatus = 'disconnected';
    try {
      const conn = await getDbConnection();
      if (conn && conn.connection && conn.connection.db) {
        await conn.connection.db.admin().ping();
        mongodbStatus = 'connected';
      }
    } catch (dbErr) {
      console.warn("Active MongoDB ping check failed:", dbErr);
      mongodbStatus = 'disconnected';
    }

    // 2. Active OpenAI Check (sending a '.' prompt)
    let openaiStatus = 'inactive';
    if (process.env.OPENAI_API_KEY) {
      try {
        const { OpenAI } = require('openai');
        const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const chatCompletion = await openaiClient.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: '.' }],
          max_tokens: 5,
        });
        if (chatCompletion?.choices?.[0]?.message?.content) {
          openaiStatus = 'active';
        }
      } catch (openAiErr) {
        console.error("Active OpenAI check failed:", openAiErr);
        openaiStatus = 'inactive';
      }
    }

    const resendStatus = process.env.RESEND_API_KEY ? 'active' : 'inactive';

    return {
      success: true,
      status: {
        mongodb: mongodbStatus,
        openai: openaiStatus,
        resend: resendStatus
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 5. Flow Simulation Action (Checks Local Knowledge, falls back to ChatGPT Core)
export async function simulatePromptFlowAction(
  userQuestion: string,
  aiSettings: {
    systemPrompt: string;
    localKnowledge: string;
    openaiModel: string;
    temperature: number;
  }
) {
  try {
    const log: string[] = [];
    let responseText = '';
    let source = '';

    const hasApiKey = !!process.env.OPENAI_API_KEY;

    log.push("Iniciando flujo de simulación en vivo...");
    log.push(`Modelo seleccionado: ${aiSettings.openaiModel || 'gpt-4o-mini'}`);

    if (hasApiKey) {
      const { OpenAI } = require('openai');
      const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // Step 1: Check in Local Knowledge
      log.push("Buscando respuesta en el CONOCIMIENTO LOCAL (Documentación)...");
      
      const localKnowledgeText = aiSettings.localKnowledge || '';

      if (localKnowledgeText.trim() === '') {
        log.push("El CONOCIMIENTO LOCAL está vacío. Saltando búsqueda local...");
      } else {
        try {
          const promptToSearchLocal = `Eres un motor de búsqueda local de documentación de FabricSoft. Tienes acceso al siguiente texto de CONOCIMIENTO LOCAL:
---
${localKnowledgeText}
---
Pregunta del usuario: "${userQuestion}"

Tu tarea es determinar si el CONOCIMIENTO LOCAL de arriba contiene la respuesta a la pregunta del usuario.
Si el CONOCIMIENTO LOCAL contiene la información para responder la pregunta, responde a la pregunta de manera concisa basándote ÚNICAMENTE en el conocimiento local proporcionado.
Si el CONOCIMIENTO LOCAL NO contiene la respuesta, debes responder EXACTAMENTE con la palabra: NOT_FOUND`;

          const chatCompletion = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: promptToSearchLocal }],
            max_tokens: 300,
            temperature: 0.1
          });

          const localResponse = chatCompletion?.choices?.[0]?.message?.content?.trim() || '';

          if (localResponse !== 'NOT_FOUND' && !localResponse.includes('NOT_FOUND')) {
            responseText = localResponse;
            source = 'local_knowledge';
            log.push("¡Coincidencia encontrada en el CONOCIMIENTO LOCAL!");
            log.push("Respuesta generada utilizando la documentación técnica de FabricSoft.");
          } else {
            log.push("La información no fue encontrada en el CONOCIMIENTO LOCAL.");
          }
        } catch (localErr: any) {
          console.error("Error checking local knowledge via OpenAI:", localErr);
          log.push(`Error al buscar en conocimiento local: ${localErr.message}. Continuando al fallback...`);
        }
      }

      // Step 2: Fallback to ChatGPT Core with System Prompt if not answered yet
      if (!responseText) {
        log.push("Redirigiendo consulta a ChatGPT Core con el PROMPT DEL SISTEMA...");
        try {
          const systemMessage = aiSettings.systemPrompt || "Eres un ingeniero experto en remediación e integración de sistemas en FABRIC.";
          const chatCompletion = await openaiClient.chat.completions.create({
            model: aiSettings.openaiModel || 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: userQuestion }
            ],
            temperature: aiSettings.temperature !== undefined ? aiSettings.temperature : 0.7
          });

          responseText = chatCompletion?.choices?.[0]?.message?.content || '';
          source = 'chatgpt_core';
          log.push("Respuesta generada exitosamente desde ChatGPT Core usando el Prompt del Sistema.");
        } catch (openaiErr: any) {
          console.error("Error generating response from ChatGPT Core:", openaiErr);
          log.push(`Error al consultar ChatGPT Core: ${openaiErr.message}`);
          throw openaiErr;
        }
      }

    } else {
      // Mock flow when no API key is set
      log.push("[MOCK] Sin llave API configurada. Ejecutando simulación local...");
      log.push("Buscando palabras clave en el CONOCIMIENTO LOCAL...");

      const lowerQuestion = userQuestion.toLowerCase();
      const localKnowledgeText = aiSettings.localKnowledge || '';
      const systemPromptText = aiSettings.systemPrompt || '';

      // Simple keyword matching for mock
      let foundInLocalMock = false;
      if (localKnowledgeText.trim() !== '') {
        const words = lowerQuestion.split(/\s+/).filter(w => w.length > 4);
        for (const word of words) {
          if (localKnowledgeText.toLowerCase().includes(word)) {
            foundInLocalMock = true;
            break;
          }
        }
      }

      if (foundInLocalMock) {
        log.push("¡Coincidencia [MOCK] encontrada en el CONOCIMIENTO LOCAL!");
        responseText = `[Consola IA - Respuesta de Conocimiento Local (MOCK)]\nSe detectó información relevante sobre su consulta en el Conocimiento Local guardado.\n\nExtracto: "${localKnowledgeText.substring(0, 150)}..."\n\nRespuesta de especificación técnica de FabricSoft: "El proceso de sincronización local se ejecuta antes de enviar a Oracle REST APIs."`;
        source = 'local_knowledge';
      } else {
        log.push("No se encontró información [MOCK] en el Conocimiento Local.");
        log.push("Redirigiendo consulta a ChatGPT Core con el PROMPT DEL SISTEMA...");
        responseText = `[Consola IA - Respuesta de ChatGPT Core (MOCK)]\nRespondiento según el Prompt del Sistema.\n\nSystem Prompt: "${systemPromptText.substring(0, 100)}..."\n\nRespuesta de ingeniería de FABRIC: "Priorizamos la estabilización del subledger general y las conexiones REST API sin parches manuales. Analizando arquitectura legacy."`;
        source = 'chatgpt_core';
      }
    }

    return {
      success: true,
      responseText,
      source,
      log
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Available Slot Management Actions for Admin
export async function getAdminAvailableSlotsAction() {
  try {
    const conn = await getDbConnection();
    if (conn) {
      const slots = await AvailableSlot.find().sort({ date: 1, timeSlot: 1 });
      return { success: true, slots: JSON.parse(JSON.stringify(slots)) };
    } else {
      if (!global.mockAvailableSlots) {
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
      return { success: true, slots: global.mockAvailableSlots };
    }
  } catch (error: any) {
    console.error("Error in getAdminAvailableSlotsAction:", error);
    return { success: false, slots: [], error: error.message };
  }
}

export async function createAvailableSlotAction(data: { date: string, timeSlot: string }) {
  try {
    const conn = await getDbConnection();
    if (conn) {
      const exists = await AvailableSlot.findOne({ date: data.date, timeSlot: data.timeSlot });
      if (exists) {
        return { success: false, error: 'Este slot de fecha y hora ya está configurado.' };
      }
      const newSlot = new AvailableSlot({
        date: data.date,
        timeSlot: data.timeSlot,
        isBooked: false
      });
      await newSlot.save();
    } else {
      if (!global.mockAvailableSlots) {
        global.mockAvailableSlots = [];
      }
      const exists = global.mockAvailableSlots.some(
        (s: any) => s.date === data.date && s.timeSlot === data.timeSlot
      );
      if (exists) {
        return { success: false, error: 'Este slot de fecha y hora ya está configurado (mock).' };
      }
      global.mockAvailableSlots.push({
        _id: 'mock-slot-' + Date.now(),
        date: data.date,
        timeSlot: data.timeSlot,
        isBooked: false,
        createdAt: new Date()
      });
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error in createAvailableSlotAction:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAvailableSlotAction(id: string) {
  try {
    const conn = await getDbConnection();
    if (conn) {
      const slot = await AvailableSlot.findById(id);
      if (slot && slot.isBooked) {
        return { success: false, error: 'No se puede eliminar un slot que ya está reservado.' };
      }
      await AvailableSlot.findByIdAndDelete(id);
    } else {
      if (global.mockAvailableSlots) {
        const slot = global.mockAvailableSlots.find((s: any) => s._id === id);
        if (slot && slot.isBooked) {
          return { success: false, error: 'No se puede eliminar un slot reservado (mock).' };
        }
        global.mockAvailableSlots = global.mockAvailableSlots.filter((s: any) => s._id !== id);
      }
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteAvailableSlotAction:", error);
    return { success: false, error: error.message };
  }
}

// 6. System Log Actions
export async function getSystemLogsAction() {
  try {
    const conn = await getDbConnection();
    if (!conn) {
      if (!global.mockLogs) {
        global.mockLogs = [
          { _id: 'l1', timestamp: new Date(Date.now() - 5000), level: 'success', category: 'email', message: 'Correo de Meet enviado con éxito a maria@retailcorp.com y antonio.salazar@fabricsoft.com.mx', details: { resendId: 'dpl_xxx' } },
          { _id: 'l2', timestamp: new Date(Date.now() - 60000), level: 'info', category: 'database', message: 'Sincronización de base de datos completada: 14 referencias verificadas.', details: null },
          { _id: 'l3', timestamp: new Date(Date.now() - 120000), level: 'warn', category: 'system', message: 'Conexión primaria a MongoDB falló. Utilizando almacenamiento temporal en caché en memoria.', details: null },
          { _id: 'l4', timestamp: new Date(Date.now() - 360000), level: 'info', category: 'auth', message: 'Inicio de sesión de administrador exitoso para antonio.salazar@fabricsoft.com.mx', details: { clientIp: '192.168.1.5' } },
          { _id: 'l5', timestamp: new Date(Date.now() - 500000), level: 'success', category: 'lead', message: 'Nueva solicitud de admisión Waitlist registrada para CFO APE Plazas', details: { scenario: 'rescue' } }
        ];
      }
      return { success: true, logs: global.mockLogs };
    }

    const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(100);
    return { success: true, logs: JSON.parse(JSON.stringify(logs)) };
  } catch (error: any) {
    console.error("Error in getSystemLogsAction:", error);
    return { success: false, error: error.message };
  }
}

export async function clearSystemLogsAction() {
  try {
    const conn = await getDbConnection();
    if (conn) {
      await SystemLog.deleteMany({});
    } else {
      global.mockLogs = [];
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error in clearSystemLogsAction:", error);
    return { success: false, error: error.message };
  }
}

export async function createSystemLog(level: string, category: string, message: string, details?: any) {
  try {
    const conn = await getDbConnection();
    if (conn) {
      const newLog = new SystemLog({ level, category, message, details: details ? JSON.parse(JSON.stringify(details)) : null });
      await newLog.save();
    } else {
      if (!global.mockLogs) {
        global.mockLogs = [];
      }
      global.mockLogs.unshift({
        _id: 'l-mock-' + Date.now(),
        timestamp: new Date(),
        level,
        category,
        message,
        details
      });
      if (global.mockLogs.length > 50) {
        global.mockLogs.pop();
      }
    }
  } catch (err) {
    console.error("Failed to write system log:", err);
  }
}

