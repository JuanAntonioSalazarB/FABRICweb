"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, FileText, UserCheck, ShieldCheck, ChevronRight, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { submitEvidenceRequestAction } from '@/app/actions/leads';

interface AuditEvent {
  date: string;
  title: string;
  evidence: string;
  docName: string;
}

interface AuditTrailData {
  caseName: string;
  verifier: string;
  verifierRole: string;
  verifierCompany: string;
  timeline: AuditEvent[];
}

export default function AuditTrailSection() {
  const [activeCase, setActiveCase] = useState<'ape' | 'aplazo'>('ape');
  const [gatedDoc, setGatedDoc] = useState<string | null>(null);
  const [requestName, setRequestName] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestCompany, setRequestCompany] = useState('');
  const [requestRole, setRequestRole] = useState('');
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const auditTrails: Record<'ape' | 'aplazo', AuditTrailData> = {
    ape: {
      caseName: "APE Plazas — Remediación de facturación masiva",
      verifier: "Ing. Roberto Valdez",
      verifierRole: "Director de Finanzas y Control",
      verifierCompany: "APE Plazas",
      timeline: [
        {
          date: "06 Abril 2026",
          title: "Go-live ejecutado en producción",
          evidence: "Acta formal de liberación del módulo de facturación masiva de arrendamientos en Oracle Fusion Cloud.",
          docName: "Acta_GoLive_APE_Plazas.pdf"
        },
        {
          date: "15 Abril 2026",
          title: "Cierre quincenal validado y conciliado",
          evidence: "Reporte de latencia y consistencia de base de datos OCI sin inconsistencias en el Libro Auxiliar.",
          docName: "Reporte_Latencia_Cierre_Q1_APE.pdf"
        },
        {
          date: "30 Abril 2026",
          title: "Cierre contable completo sin incidencias",
          evidence: "Acta de estabilización operativa y transición a soporte interno firmada de mutuo acuerdo.",
          docName: "Acta_Transicion_Soporte_APE.pdf"
        }
      ]
    },
    aplazo: {
      caseName: "Aplazo — Estabilización de cobros y conciliación GL",
      verifier: "Lic. Sofía Macías",
      verifierRole: "Subdirectora de Sistemas e Integraciones",
      verifierCompany: "Aplazo",
      timeline: [
        {
          date: "04 Marzo 2026",
          title: "Interfaz de cobros recurrentes operando con SLA < 20ms",
          evidence: "Log auditado de transacciones de cobro recurrentes integradas de pasarela al ERP Oracle.",
          docName: "Log_Performance_Gateway_Aplazo.pdf"
        },
        {
          date: "18 Marzo 2026",
          title: "Cuadratura automática del auxiliar de CXC con GL",
          evidence: "Reporte de validación de asientos contables cruzados en Libro Mayor sin diferencias.",
          docName: "Reporte_Auditoria_Cuadratura_CXC.pdf"
        },
        {
          date: "15 Abril 2026",
          title: "Tiempo de cierre contable reducido de 5 días a 4 horas",
          evidence: "Acta de entrega operativa del cierre de ciclo crítico firmada por el contralor financiero.",
          docName: "Acta_Aceptacion_Cierre_Ciclo_Critico.pdf"
        }
      ]
    }
  };

  const currentTrail = auditTrails[activeCase];

  const handleOpenRequest = (docName: string) => {
    setGatedDoc(docName);
    setRequestSuccess(false);
    setRequestName('');
    setRequestEmail('');
    setRequestCompany('');
    setRequestRole('');
    setNdaAccepted(false);
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
      setErrorMsg('Solo se aceptan correos corporativos.');
      return;
    }

    if (!ndaAccepted) {
      setErrorMsg('Debes aceptar el acuerdo de confidencialidad para continuar.');
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
        caseId: activeCase,
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
    <section id="audit-trail" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950 font-mono text-xs">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="mb-12 reveal-on-scroll">
          <span className="badge-premium mb-3 inline-block">CASOS DE ÉXITO AUDITABLES</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light mb-4">
            ¿Tu proveedor actual te oculta sus tiempos de entrega reales? <span className="text-accent">Audita nuestro historial antes de arriesgarte.</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl font-sans leading-relaxed">
            Publicamos el registro exacto de hitos de entrega de cada proyecto: fechas de go-live, cierres contables y actas de estabilización. Si estás en proceso de contratación activa, puedes solicitar los documentos originales bajo un NDA mutuo.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 reveal-on-scroll">
          
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="relative border border-zinc-800 bg-black/40 p-6 md:p-8 space-y-6 rounded">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/40" />
              
              <div className="space-y-4">
                <span className="text-[10px] text-accent font-bold uppercase block tracking-wider">── CÓMO FUNCIONA ──</span>
                
                <div className="space-y-3 font-sans text-xs text-zinc-400 leading-relaxed">
                  <p className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">→</span>
                    <span>Cada hito publicado corresponde a un documento oficial firmado por el cliente.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">→</span>
                    <span>Puedes solicitar cualquier archivo original. Te enviamos un NDA mutuo a tu correo corporativo.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">→</span>
                    <span>Una vez firmado, liberamos el documento auditado en menos de 2 horas hábiles.</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-900 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                    <span className="text-zinc-600 block mb-1">DOCUMENTOS</span>
                    <span className="text-accent font-bold">Firmados</span>
                  </div>
                  <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                    <span className="text-zinc-600 block mb-1">ACCESO</span>
                    <span className="text-accent font-bold">Bajo NDA</span>
                  </div>
                  <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                    <span className="text-zinc-600 block mb-1">ENTREGA</span>
                    <span className="text-emerald-500 font-bold">&lt; 2 horas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-zinc-900 bg-zinc-950/40 p-4 rounded text-zinc-500 font-sans text-xs leading-relaxed">
              <span className="font-mono text-[10px] text-accent font-bold block mb-1">CONFIDENCIALIDAD</span>
              El nombre del verificador y los documentos originales nunca se exponen públicamente. El NDA mutuo protege tanto al cliente ancla como al solicitante.
            </div>
          </div>

          {/* Right Column: Interactive Audit Viewer */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card-premium p-6 md:p-8 bg-black border border-zinc-800 rounded relative">
              
              {/* Tab Selector */}
              <div className="flex border-b border-zinc-950 pb-4 gap-2">
                <button
                  onClick={() => { setActiveCase('ape'); setGatedDoc(null); }}
                  className={`px-4 py-2 border transition-all cursor-pointer font-serif text-sm rounded ${
                    activeCase === 'ape'
                      ? 'border-accent bg-accent/5 text-white font-light'
                      : 'border-zinc-900 bg-zinc-950 hover:border-zinc-800 text-zinc-500'
                  }`}
                >
                  APE Plazas
                </button>
                <button
                  onClick={() => { setActiveCase('aplazo'); setGatedDoc(null); }}
                  className={`px-4 py-2 border transition-all cursor-pointer font-serif text-sm rounded ${
                    activeCase === 'aplazo'
                      ? 'border-accent bg-accent/5 text-white font-light'
                      : 'border-zinc-900 bg-zinc-950 hover:border-zinc-800 text-zinc-500'
                  }`}
                >
                  Aplazo
                </button>
              </div>

              {/* Case Summary */}
              <div className="mt-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Registro público</span>
                    <h3 className="text-base font-serif text-white font-light leading-tight">{currentTrail.caseName}</h3>
                    <Link 
                      href={`/casos/${activeCase === 'ape' ? 'ape-plazas' : 'aplazo'}/audit-trail`}
                      className="text-accent hover:underline text-[10px] block font-mono mt-1"
                    >
                      /casos/{activeCase === 'ape' ? 'ape-plazas' : 'aplazo'}/audit-trail →
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] text-emerald-500 bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-1 rounded">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Trail auditado</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative border-l border-zinc-800 pl-6 ml-3 py-2 space-y-6">
                  {currentTrail.timeline.map((event, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 bg-black border border-zinc-700 rounded-full flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-colors">
                        <div className="h-1.5 w-1.5 bg-zinc-700 group-hover:bg-accent rounded-full" />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="text-white font-bold">{event.date}</span>
                        </div>
                        <h4 className="text-zinc-300 font-sans text-xs font-semibold">{event.title}</h4>
                        <p className="text-zinc-500 font-sans text-xs leading-relaxed max-w-xl">{event.evidence}</p>
                        
                        <button
                          onClick={() => handleOpenRequest(event.docName)}
                          className="flex flex-wrap items-center gap-2 text-accent hover:text-white transition-colors text-[10px] cursor-pointer pt-1 font-bold uppercase"
                        >
                          <div className="flex items-center gap-1 bg-accent/10 border border-accent/30 px-2 py-0.5 rounded text-[9px] text-accent">
                            <Lock className="w-3 h-3 text-accent shrink-0 animate-pulse" />
                            <span>[ ACCESO ENCRIPTADO BAJO NDA MUTUO ]</span>
                          </div>
                          <span className="underline">Solicitar documento: {event.docName}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verifier block */}
                <div className="border-t border-zinc-900 pt-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">Verificable bajo NDA</span>
                      <span className="text-zinc-300 font-bold">{currentTrail.verifier}</span>
                      <span className="text-zinc-500 text-[10px] font-sans ml-1">({currentTrail.verifierRole}, {currentTrail.verifierCompany})</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleOpenRequest(`contacto-directo-${activeCase}.pdf`)}
                    className="btn-outline-accent !py-2 !px-4 text-[10px] shrink-0 flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-accent shrink-0" />
                    Solicitar referencia directa [NDA]
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Modal */}
      {gatedDoc && (
        <div className="fixed inset-0 z-[2500] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-accent p-6 md:p-8 max-w-md w-full relative space-y-6">
            
            <button
              onClick={() => setGatedDoc(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer font-mono text-[10px] border border-zinc-800 px-2.5 py-1 bg-black"
            >
              [CERRAR ✕]
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Lock className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Solicitud de evidencia bajo NDA</span>
                  <h4 className="text-sm text-white font-bold leading-tight mt-1">
                    <span className="font-mono text-zinc-400">{gatedDoc}</span>
                  </h4>
                </div>
              </div>

              {requestSuccess ? (
                <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 text-center space-y-3 rounded">
                  <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h5 className="text-white text-xs font-serif font-light">Solicitud recibida</h5>
                  <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                    Enviamos el Acuerdo de Confidencialidad Mutuo a tu correo corporativo. Una vez firmado digitalmente, liberamos el documento auditado en menos de 2 horas hábiles.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <p className="text-zinc-500 font-sans text-xs leading-relaxed">
                    Ingresa tus datos corporativos para recibir el NDA. No compartimos tu información con terceros.
                  </p>
                  
                  <div className="space-y-3 font-mono">
                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px] uppercase tracking-wider">Nombre completo</label>
                      <input
                        type="text"
                        required
                        value={requestName}
                        onChange={(e) => setRequestName(e.target.value)}
                        placeholder="Roberto Martínez"
                        className="w-full bg-black border border-zinc-800 text-white px-3 py-2 outline-none focus:border-accent text-xs"
                      />
                    </div>
                    
                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px] uppercase tracking-wider">Correo corporativo</label>
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
                      <label className="text-zinc-500 block mb-1 text-[9px] uppercase tracking-wider">Empresa</label>
                      <input
                        type="text"
                        required
                        value={requestCompany}
                        onChange={(e) => setRequestCompany(e.target.value)}
                        placeholder="Banco del Norte S.A."
                        className="w-full bg-black border border-zinc-800 text-white px-3 py-2 outline-none focus:border-accent text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px] uppercase tracking-wider">Cargo / Puesto</label>
                      <input
                        type="text"
                        required
                        value={requestRole}
                        onChange={(e) => setRequestRole(e.target.value)}
                        placeholder="CIO / Director de Finanzas"
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
                        Acepto la emisión de un Acuerdo de Confidencialidad mutuo sobre la evidencia técnica solicitada.
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
                    {loading ? 'Procesando...' : 'Enviar solicitud de NDA'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </section>
  );
}