"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, Lock, Building, Landmark, Wallet, Award, Users } from 'lucide-react';
import { getPublicReferencesConsentAction } from '@/app/actions/dashboard';

const REF_DETAILS: Record<string, {
  title: string;
  subtitle: string;
  context: string;
  iconName: 'building' | 'landmark' | 'wallet' | 'users' | 'award';
}> = {
  'ref-1': {
    title: 'CFO de operadora de centros comerciales',
    subtitle: 'Industria: Inmobiliaria / Centros Comerciales (LATAM)',
    context: 'Estabilización de reportabilidad contable, conciliación de arrendamientos y cierres multimoneda.',
    iconName: 'building'
  },
  'ref-2': {
    title: 'CTO de institución financiera',
    subtitle: 'Volumen: USD 300M+ Revenue Anual',
    context: 'Integraciones críticas de core bancario con Oracle ERP, automatización de pólizas contables masivas.',
    iconName: 'landmark'
  },
  'ref-3': {
    title: 'CFO Controller de fintech regulada',
    subtitle: 'Industria: Fintech / Regulación Financiera',
    context: 'Auditoría y remediación de procesos de consolidación fiscal en Fusion Cloud, reportes normativos automatizados.',
    iconName: 'wallet'
  },
  'ref-4': {
    title: 'CISO/CTO de fintech de crédito al consumo',
    subtitle: 'Área: Seguridad e Integraciones Financieras',
    context: 'Seguridad de accesos, flujos de conciliación automatizada de cobranza e integraciones con pasarelas de pago.',
    iconName: 'users'
  },
  'ref-5': {
    title: 'Director de Consultoría de Oracle ACS',
    subtitle: 'Especialidad: Ecosistema Oracle Services',
    context: 'Perspectiva externa sobre metodologías de estabilización e ingeniería avanzada en remediación de proyectos Fusion.',
    iconName: 'award'
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

export default function ReferenciasPage() {
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
        console.error("Error fetching public references:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReferences();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'building': return <Building className="w-5 h-5" />;
      case 'landmark': return <Landmark className="w-5 h-5" />;
      case 'wallet': return <Wallet className="w-5 h-5" />;
      case 'users': return <Users className="w-5 h-5" />;
      case 'award': return <Award className="w-5 h-5" />;
      default: return <Building className="w-5 h-5" />;
    }
  };

  const renderStatusBadge = (status: string, lastValidated: string) => {
    const formattedDate = formatValidationDate(lastValidated);
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-full font-mono shrink-0">
            ✓ Validado - {formattedDate}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold text-amber-400 bg-amber-950/20 border border-amber-900/40 rounded-full font-mono shrink-0">
            ⌛ En validación de disponibilidad
          </span>
        );
      case 'revoked':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold text-zinc-500 bg-zinc-950/20 border border-zinc-900/40 rounded-full font-mono shrink-0">
            ❌ Temporalmente no disponible
          </span>
        );
    }
  };

  const renderSkeletons = () => (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 border-b border-zinc-900 pb-4">
          <div className="w-10 h-10 rounded bg-zinc-950 border border-zinc-900 shrink-0" />
          <div className="space-y-2 font-mono text-xs flex-1">
            <div className="h-4 bg-zinc-900 rounded w-1/3" />
            <div className="h-3 bg-zinc-900 rounded w-1/2" />
            <div className="h-2 bg-zinc-900 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-mono text-xs transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">/referencias</span>
        </div>

        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="badge-premium">REFERENCIAS OPERATIVAS</span>
            <span className="text-[10px] text-accent uppercase font-bold bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
              Bajo NDA Mutuo
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white font-light">
            Hablar con quienes ya operan con FABRIC
          </h1>
          <p className="text-zinc-400 font-sans text-sm max-w-3xl leading-relaxed">
            La decisión de contratar soporte de ingeniería crítica para sistemas ERP Oracle requiere validación directa de primer nivel.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Reference Listing & CTA */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="card-premium p-6 md:p-8 relative overflow-hidden bg-black border border-zinc-800">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/40" />
              
              <span className="text-[10px] text-accent font-mono uppercase tracking-widest block mb-6">
                Directorio de Referencias Calificadas
              </span>
              
              {/* References List */}
              {loading ? (
                renderSkeletons()
              ) : (
                <div className="space-y-6">
                  {references.map((ref, index) => {
                    const details = {
                      title: ref.title || REF_DETAILS[ref.id]?.title || 'Referencia de Cliente',
                      subtitle: ref.subtitle || REF_DETAILS[ref.id]?.subtitle || 'Soporte Especializado Oracle',
                      context: ref.context || REF_DETAILS[ref.id]?.context || 'Remediación y estabilización de sistemas core ERP.',
                      iconName: ref.iconName || REF_DETAILS[ref.id]?.iconName || 'building'
                    };

                    const isLast = index === references.length - 1;

                    return (
                      <div 
                        key={ref.id} 
                        className={`flex gap-4 ${!isLast ? 'border-b border-zinc-900 pb-4' : 'pb-2'}`}
                      >
                        <div className="w-10 h-10 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center text-accent shrink-0">
                          {getIcon(details.iconName)}
                        </div>
                        <div className="space-y-1.5 font-mono text-xs flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="text-white text-sm font-medium">{details.title}</h3>
                            {renderStatusBadge(ref.consentStatus, ref.lastValidated)}
                          </div>
                          <p className="text-zinc-400">{details.subtitle}</p>
                          <p className="text-[10px] text-zinc-600">{details.context}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Shield Warning & Iniciar Evaluacion CTA */}
            <div className="card-premium p-6 bg-zinc-950/20 border border-zinc-900 rounded space-y-4">
              <div className="flex gap-3 items-start">
                <Lock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="font-mono text-xs space-y-2">
                  <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">Acceso bajo Protocolo de Admisión</h4>
                  <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                    Para proteger la confidencialidad y el tiempo de nuestros clientes activos, las referencias se acceden únicamente al pasar la evaluación inicial de admisión de FABRIC.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/aplicar" className="btn-primary-accent w-full justify-center py-3 text-xs uppercase font-mono tracking-wider">
                  Iniciar evaluación →
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: ASCII Representation & Strategy Scorecard */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* ASCII Concept Box */}
            <div className="border border-zinc-800 bg-zinc-950/40 p-4 rounded text-zinc-500 leading-normal font-mono text-[9px] overflow-x-auto whitespace-pre select-text">
{`┌────────────────────────────────────────────────────────┐
│                                                        │
│  /referencias                                          │
│                                                        │
│  "Hablar con quienes ya operan con FABRIC."            │
│                                                        │
│  ─────────────────────────────────────────             │
│                                                        │
│  La decisión de contratar Oracle Critical Engineering  │
│  requiere validación directa.                          │
│                                                        │
│  Prospectos calificados (post-evaluación inicial) pueden│
│  conversar directamente con ejecutivos de              │
│  organizaciones que ya operan con FABRIC.              │
│                                                        │
│  Referencias disponibles (bajo NDA):                   │
│                                                        │
│  · CFO de operadora de centros comerciales (LATAM)     │
│  · CTO de institución financiera (USD 300M+)           │
│  · CFO Controller de fintech regulada                  │
│  · CISO/CTO de fintech de crédito al consumo           │
│  · Director de Consultoría de Oracle ACS               │
│                                                        │
│  Las referencias se acceden al pasar la evaluación     │
│  inicial de admisión.                                  │
│                                                        │
│  [Iniciar evaluación →]                                │
│                                                        │
└────────────────────────────────────────────────────────┘`}
            </div>

            {/* Strategic Rationale */}
            <div className="relative border border-zinc-800 bg-black/40 p-6 space-y-4 rounded">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent/40" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-accent/40" />
              
              <span className="text-[10px] text-accent font-bold uppercase font-mono block tracking-wider">
                ── DISCIPLINA DE CONTROL ──
              </span>
              
              <ul className="space-y-3 font-sans text-xs text-zinc-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 font-bold">•</span>
                  <span><strong>Protección de Identidad:</strong> No publicamos nombres completos ni marcas comerciales de manera abierta para resguardar la privacidad de nuestros sponsors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 font-bold">•</span>
                  <span><strong>Filtro de Calificación:</strong> Evitamos el desgaste de nuestros clientes con llamadas exploratorias sin compromisos serios o viabilidad aprobada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 font-bold">•</span>
                  <span><strong>Acuerdo NDA:</strong> Antes de programar cualquier llamada de referencia directa, se firmará un acuerdo de confidencialidad recíproco.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
