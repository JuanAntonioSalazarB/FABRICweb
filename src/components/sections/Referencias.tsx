"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Building, Landmark, Wallet, Award, Users, ArrowRight } from 'lucide-react';
import { getPublicReferencesConsentAction } from '@/app/actions/dashboard';

interface ReferenciasProps {
  setActiveOverlayModal: (modal: 'erp' | 'cloud' | 'diagnostico' | 'office-hours' | 'ape-plazas' | 'aplazo' | 'doctrina' | 'transparencia' | null) => void;
}

const REF_DETAILS: Record<string, {
  title: string;
  context: string;
  iconName: 'building' | 'landmark' | 'wallet' | 'users' | 'award';
  auditId: string;
}> = {
  'ref-1': {
    title: 'CFO de operadora de centros comerciales (LATAM)',
    context: 'Conciliaciones complejas y reportabilidad multimoneda en Fusion Cloud.',
    iconName: 'building',
    auditId: 'REF-APE-2026'
  },
  'ref-2': {
    title: 'CTO de institución financiera (USD 300M+)',
    context: 'Integración de base de datos transaccional con Oracle ERP Cloud.',
    iconName: 'landmark',
    auditId: 'REF-CTO-2026'
  },
  'ref-3': {
    title: 'CFO Controller de fintech regulada',
    context: 'Auditoría, reportes normativos y remediación contable de Fusion.',
    iconName: 'wallet',
    auditId: 'REF-FIN-2026'
  },
  'ref-4': {
    title: 'CISO/CTO de fintech de crédito al consumo',
    context: 'Seguridad transaccional, automatización de cobro e interfaces bancarias.',
    iconName: 'users',
    auditId: 'REF-APZ-2026'
  },
  'ref-5': {
    title: 'Director de Consultoría de Oracle ACS',
    context: 'Análisis técnico externo y validación de metodología de remediación.',
    iconName: 'award',
    auditId: 'REF-ACS-2026'
  }
};

function formatValidationDate(dateStr: string) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 2) return dateStr;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const monthName = months[monthIndex - 1] || '';
  return `${monthName} ${year}`;
}

export default function Referencias({ setActiveOverlayModal }: ReferenciasProps) {
  const [references, setReferences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReferences() {
      try {
        const res = await getPublicReferencesConsentAction();
        if (res.success && res.references) {
          setReferences(res.references);
        }
      } catch (err) {
        console.error("Error fetching public references for home:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReferences();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'building': return <Building className="w-4 h-4" />;
      case 'landmark': return <Landmark className="w-4 h-4" />;
      case 'wallet': return <Wallet className="w-4 h-4" />;
      case 'users': return <Users className="w-4 h-4" />;
      case 'award': return <Award className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const renderStatusBadge = (status: string, lastValidated: string) => {
    const formattedDate = formatValidationDate(lastValidated);
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-full font-mono shrink-0">
            ✓ Validado - {formattedDate}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-bold text-amber-400 bg-amber-950/20 border border-amber-900/40 rounded-full font-mono shrink-0">
            ⌛ En validación
          </span>
        );
      case 'revoked':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-bold text-zinc-500 bg-zinc-950/20 border border-zinc-900/40 rounded-full font-mono shrink-0">
            ❌ No disponible
          </span>
        );
    }
  };

  const renderSkeletons = () => (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 border border-zinc-900 bg-zinc-950/20 rounded-xl flex gap-3 items-start">
          <div className="w-4 h-4 bg-zinc-900 rounded shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="h-3.5 bg-zinc-900 rounded w-1/2" />
            <div className="h-3 bg-zinc-900 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="referencias" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-black font-mono">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 reveal-on-scroll">
          <span className="badge-premium mb-3 inline-block">VALIDACIÓN DIRECTA</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light mb-4">
            No decidas a ciegas la seguridad de tu core Oracle: <span className="text-accent">Habla directamente con quienes ya operan sin riesgo.</span>
          </h2>
          <p className="text-zinc-400 text-sm font-sans leading-relaxed">
            La decisión de contratar soporte de ingeniería crítica para sistemas core Oracle requiere validación real. Ofrecemos comunicación directa con quienes ya operan con FABRIC.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: References Directory */}
          <div className="lg:col-span-7 space-y-4 reveal-on-scroll">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">
              Referencias disponibles (bajo NDA):
            </span>

            {loading ? (
              renderSkeletons()
            ) : (
              <div className="space-y-3">
                {references.map((ref) => {
                  const details = {
                    title: ref.title || REF_DETAILS[ref.id]?.title || 'Referencia de Cliente',
                    context: ref.context || REF_DETAILS[ref.id]?.context || 'Soporte de ingeniería crítica para sistemas core Oracle.',
                    iconName: ref.iconName || REF_DETAILS[ref.id]?.iconName || 'building',
                    auditId: REF_DETAILS[ref.id]?.auditId || `REF-${ref.id.toUpperCase()}-2026`
                  };
                  return (
                    <div 
                      key={ref.id} 
                      className="p-4 border border-zinc-900 bg-zinc-950/40 rounded-xl flex gap-3 items-start hover:border-zinc-800 transition-all relative overflow-hidden"
                    >
                      {/* Corner bracket to give it telemetry feeling */}
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/25" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/25" />

                      <div className="mt-0.5 shrink-0 text-accent">
                        {getIcon(details.iconName)}
                      </div>
                      <div className="text-xs flex-1 space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <span className="text-white font-bold">{details.title}</span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-500 py-0.5 px-1.5 rounded uppercase tracking-wider font-bold">
                              {details.auditId}
                            </span>
                            {renderStatusBadge(ref.consentStatus, ref.lastValidated)}
                          </div>
                        </div>
                        <span className="text-zinc-500 block leading-normal">{details.context}</span>
                        <div className="flex items-center gap-1 text-[8px] font-mono text-accent uppercase tracking-wider">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>Documentación de Acreditación Firmada & Verificada</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Concept ASCII Visual & Action Card */}
          <div className="lg:col-span-5 space-y-6 reveal-on-scroll reveal-delay-200">
            
            {/* Styled Card resembling the spec container */}
            <div className="card-premium p-6 relative bg-zinc-950 border border-zinc-800 rounded">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/40" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/40" />
              
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-2 text-[10px] text-accent font-bold uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" /> Disciplina de Acceso Premium
                </div>
                
                <p className="text-zinc-400 font-sans leading-relaxed text-xs">
                  No publicamos nombres de clientes ni marcas de forma abierta. Para proteger su agenda, las llamadas de referencia están reservadas únicamente para prospectos que aprueben la evaluación de admisión.
                </p>

                <div className="border-t border-zinc-900 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>EVALUACIÓN REQUERIDA:</span>
                    <span className="text-emerald-500 font-bold">ACTIVA</span>
                  </div>
                  <p className="text-zinc-500 text-[10px]">
                    Las credenciales se validarán contra dominios corporativos. Aplican firmas de NDA recíprocas.
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <a href="#admision" className="btn-primary-accent w-full justify-center text-center text-xs">
                    Iniciar evaluación →
                  </a>
                </div>
              </div>
            </div>

            {/* Micro ASCII illustration */}
            <div className="border border-zinc-900 bg-zinc-950/20 p-4 rounded text-zinc-600 font-mono text-[8px] leading-tight select-none">
              {`// SECURITY HASH VALIDATION TRACE
[SUCCESS] Domain status: corporate verified
[PENDING] NDA signature: required
[INFO] Ref slot booking: available post-admission`}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
