"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, UserCheck, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { submitEvidenceRequestAction } from '@/app/actions/leads';

interface AuditEvent {
  date: string;
  title: string;
  evidence: string;
  docName: string;
}

export default function CasoAplazoAuditTrailPage() {
  const [gatedDoc, setGatedDoc] = useState<string | null>(null);
  const [requestName, setRequestName] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestCompany, setRequestCompany] = useState('');
  const [requestRole, setRequestRole] = useState('');
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const timeline: AuditEvent[] = [
    {
      date: "04 Marzo 2026",
      title: "Puesta en marcha de Interfaz de Cobros Recurrentes (SLA < 20ms)",
      evidence: "Log auditado de transacciones de cobro recurrentes integradas de pasarela al ERP Oracle.",
      docName: "Log_Performance_Gateway_Aplazo.pdf"
    },
    {
      date: "18 Marzo 2026",
      title: "Cuadratura Automática del Auxiliar de CXC con GL",
      evidence: "Reporte de cuadratura y validación de asientos contables cruzados en Libro Mayor.",
      docName: "Reporte_Auditoria_Cuadratura_CXC.pdf"
    },
    {
      date: "15 Abril 2026",
      title: "Reducción del Tiempo de Cierre Contable de 5 Días a 4 Horas",
      evidence: "Acta de entrega operativa del cierre de ciclo crítico firmada por el contralor financiero.",
      docName: "Acta_Aceptacion_Cierre_Ciclo_Critico.pdf"
    }
  ];

  const handleOpenRequest = (docName: string) => {
    setGatedDoc(docName);
    setRequestSuccess(false);
    setErrorMsg('');
  };

  const isCorporateEmail = (email: string) => {
    const freeDomains = [
      'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 
      'icloud.com', 'mail.com', 'live.com', 'msn.com', 
      'yahoo.com.mx', 'live.com.mx', 'hotmail.es', 'yandex.com'
    ];
    const domain = email.toLowerCase().split('@')[1];
    return domain && !freeDomains.includes(domain);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCorporateEmail(requestEmail)) {
      setErrorMsg('Sólo se aceptan correos corporativos.');
      return;
    }

    if (!ndaAccepted) {
      setErrorMsg('Debe aceptar el acuerdo de confidencialidad (NDA) para continuar.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitEvidenceRequestAction({
        name: requestName,
        email: requestEmail,
        company: requestCompany,
        role: requestRole,
        docName: gatedDoc || '',
        type: 'evidence',
        caseId: 'aplazo',
        ndaAccepted: ndaAccepted
      });

      if (res.success) {
        setRequestSuccess(true);
      } else {
        setErrorMsg('Error al enviar la solicitud. Intente de nuevo.');
      }
    } catch (err) {
      setErrorMsg('Ocurrió un error al procesar el envío.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4 font-mono text-xs selection:bg-accent selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation back buttons */}
        <div className="flex justify-between items-center">
          <Link href="/casos/aplazo" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-mono text-xs transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Caso de Éxito
          </Link>
          <Link href="/" className="text-zinc-500 hover:text-white font-mono text-xs transition-colors">
            Volver al Inicio
          </Link>
        </div>

        {/* Header Section */}
        <div className="border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-premium">AUDIT TRAIL</span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">/casos/aplazo/audit-trail</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white font-light mt-1">
            Registro de Auditoría Pública: Aplazo
          </h1>
          <p className="text-zinc-400 font-sans text-sm max-w-3xl mt-2 leading-relaxed">
            Transparencia radical real. A continuación se detallan los hitos técnicos oficiales y la evidencia verificable acumulada durante el balanceo y la conciliación de subledgers con el Libro Mayor.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Audit Timeline */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card-premium p-6 md:p-8 bg-black border border-zinc-800 rounded relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/40" />

              <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">CRONOLOGÍA OPERATIVA</span>
                  <h3 className="text-base font-serif text-white font-light">Evidencia de Estabilización</h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>TRAIL VERIFICADO</span>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="relative border-l border-zinc-800 pl-6 ml-3 py-2 space-y-8">
                {timeline.map((event, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline Dot Icon */}
                    <div className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 bg-black border border-zinc-700 rounded-full flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-colors">
                      <div className="h-1.5 w-1.5 bg-zinc-700 group-hover:bg-accent rounded-full" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="text-white font-bold">{event.date}</span>
                      </div>
                      <h4 className="text-zinc-300 font-sans text-sm font-semibold">{event.title}</h4>
                      <p className="text-zinc-500 font-sans text-xs leading-relaxed max-w-2xl">{event.evidence}</p>
                      
                      {/* Evidence Gated Action */}
                      <button
                        onClick={() => handleOpenRequest(event.docName)}
                        className="flex items-center gap-1.5 text-accent hover:underline text-[10px] cursor-pointer pt-1 font-bold uppercase"
                      >
                        <Lock className="w-3.5 h-3.5 text-accent" /> Solicitar Evidencia: {event.docName}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verifier Contact */}
              <div className="border-t border-zinc-900 pt-6 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">VERIFICABLE DIRECTO BAJO NDA:</span>
                    <span className="text-zinc-300 font-bold">Lic. Sofía Macías</span>
                    <span className="text-zinc-500 text-[10px] font-sans ml-1">(Subdirectora de Sistemas e Integraciones en Aplazo)</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleOpenRequest('contacto-directo-aplazo.pdf')}
                  className="btn-outline-accent !py-2 !px-4 text-[10px] shrink-0"
                >
                  Solicitar Referencia Directa
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Strategic Scorecard (Concept explanation) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* ASCII Concept Block */}
            <div className="border border-zinc-800 bg-zinc-950/40 p-4 rounded text-zinc-500 leading-normal font-mono text-[9px] overflow-x-auto whitespace-pre select-text">
{`┌────────────────────────────────────────────────────────┐
│                                                        │
│  /casos/aplazo/audit-trail                             │
│                                                        │
│  · 04 marzo 2026: Go-live de interfaz                  │
│    Evidencia: Log auditado (PDF bajo NDA)              │
│                                                        │
│  · 18 marzo 2026: Cuadratura automática CXC            │
│    Evidencia: Reporte de auditoría (PDF bajo NDA)      │
│                                                        │
│  · 15 abril 2026: Cierre contable acelerado            │
│    Evidencia: Acta de aceptación firmada               │
│                                                        │
│  · Verificable por: [Subdirectora de Sistemas,         │
│    Aplazo, accesible bajo NDA mutuo]                   │
│                                                        │
└────────────────────────────────────────────────────────┘`}
            </div>

            {/* Why it works pitch */}
            <div className="relative border border-zinc-800 bg-black/40 p-6 space-y-4 rounded">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent/40" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-accent/40" />
              
              <span className="text-[10px] text-accent font-bold uppercase block tracking-wider">── POR QUÉ FUNCIONA ──</span>
              
              <ul className="space-y-3 font-sans text-xs text-zinc-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">·</span>
                  <span><strong>Transparencia Radical Real:</strong> Al certificar hitos con documentos reales, destruimos el escepticismo natural de los compradores del ERP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">·</span>
                  <span><strong>Prospectos Serios Verifican:</strong> Facilita a las contralorías y CIOs la validación directa de nuestra experiencia real sin intermediarios comerciales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">·</span>
                  <span><strong>Diferenciación Brutal:</strong> Contrasta de manera radical con las promesas infladas y las mentiras contractuales de las consultoras de volumen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">·</span>
                  <span><strong>Trust Defendible:</strong> El resguardo bajo NDA de los nombres y firmas protege la confidencialidad corporativa mientras construye un puente de absoluta confianza.</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-zinc-900 grid grid-cols-3 gap-2 text-center text-[9px] font-mono">
                <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                  <span className="text-zinc-600 block mb-1">COSTO</span>
                  <span className="text-emerald-500 font-bold uppercase">Bajo</span>
                </div>
                <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                  <span className="text-zinc-600 block mb-1">IMPACTO</span>
                  <span className="text-accent font-bold uppercase">Alto</span>
                </div>
                <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                  <span className="text-zinc-600 block mb-1">RIESGO</span>
                  <span className="text-amber-500 font-bold uppercase">Medio</span>
                </div>
              </div>
            </div>

            {/* Risk Mitigation */}
            <div className="border border-zinc-900 bg-zinc-950/40 p-4 rounded text-zinc-500 font-sans text-xs leading-relaxed">
              <span className="font-mono text-[10px] text-accent font-bold block mb-1">✓ NOTA DE SEGURIDAD</span>
              Para acceder a la evidencia formal o entablar contacto directo con la Subdirectora de Sistemas, es mandatorio firmar previamente el acuerdo de confidencialidad recíproco a fin de proteger la gobernanza de datos financieros del cliente original.
            </div>

          </div>

        </div>

      </div>

      {/* Internal Modal Overlay for Document Request */}
      {gatedDoc && (
        <div className="fixed inset-0 z-[2500] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-accent p-6 md:p-8 max-w-md w-full relative space-y-6">
            
            <button
              onClick={() => setGatedDoc(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer font-mono text-[10px] border border-zinc-800 px-2.5 py-1 bg-black"
            >
              [CERRAR X]
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Lock className="w-5 h-5 text-accent shrink-0 animate-pulse" />
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">SOLICITUD DE AUDITORÍA CON BAJO NDA</span>
                  <h4 className="text-sm text-white font-bold leading-tight mt-1">
                    Archivo: <span className="font-mono text-zinc-400">{gatedDoc}</span>
                  </h4>
                </div>
              </div>

              {requestSuccess ? (
                <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 text-center space-y-3 rounded">
                  <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h5 className="text-white text-xs font-serif font-light">Solicitud Procesada Exitosamente</h5>
                  <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                    Hemos enviado el borrador del Acuerdo de Confidencialidad Mutuo (NDA) a su correo corporativo. Al ser firmado digitalmente, liberaremos el archivo auditado en menos de 2 horas hábiles.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <p className="text-zinc-500 font-sans text-xs leading-relaxed">
                    Para acceder a la evidencia formal de go-live y estabilización del caso ancla, complete sus credenciales corporativas para la emisión del acuerdo de confidencialidad mutuo:
                  </p>
                  
                  <div className="space-y-3 font-mono">
                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px]">NOMBRE COMPLETO:</label>
                      <input
                        type="text"
                        required
                        value={requestName}
                        onChange={(e) => setRequestName(e.target.value)}
                        placeholder="Ej. Roberto Martinez"
                        className="w-full bg-black border border-zinc-800 text-white px-3 py-2 outline-none focus:border-accent text-xs"
                      />
                    </div>
                    
                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px]">CORREO CORPORATIVO:</label>
                      <input
                        type="email"
                        required
                        value={requestEmail}
                        onChange={(e) => setRequestEmail(e.target.value)}
                        placeholder="nombre@empresa.com"
                        className="w-full bg-black border border-zinc-800 text-white px-3 py-2 outline-none focus:border-accent text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px]">EMPRESA / INSTITUCIÓN:</label>
                      <input
                        type="text"
                        required
                        value={requestCompany}
                        onChange={(e) => setRequestCompany(e.target.value)}
                        placeholder="Ej. Banco del Norte S.A."
                        className="w-full bg-black border border-zinc-800 text-white px-3 py-2 outline-none focus:border-accent text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px]">CARGO / PUESTO:</label>
                      <input
                        type="text"
                        required
                        value={requestRole}
                        onChange={(e) => setRequestRole(e.target.value)}
                        placeholder="Ej. CIO / Director de Finanzas"
                        className="w-full bg-black border border-zinc-800 text-white px-3 py-2 outline-none focus:border-accent text-xs"
                      />
                    </div>

                    <label className="flex items-start gap-2 pt-2 cursor-pointer text-zinc-500 hover:text-zinc-400 select-none">
                      <input
                        type="checkbox"
                        checked={ndaAccepted}
                        onChange={(e) => setNdaAccepted(e.target.checked)}
                        className="mt-0.5 accent-accent"
                      />
                      <span className="font-sans text-[10px] leading-snug">
                        Acepto la emisión de un Acuerdo de Confidencialidad (NDA) mutuo sobre la evidencia técnica solicitada.
                      </span>
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="text-red-500 text-[10px] font-mono">
                      * {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary-accent w-full justify-center py-2.5 text-xs font-mono uppercase"
                  >
                    {loading ? 'Procesando...' : 'Emitir Acuerdo NDA'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
