"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, ShieldCheck, Calendar, CheckSquare, ArrowLeft, Users, Sparkles, Lock, AlertOctagon } from 'lucide-react';
import { submitWaitlistAction } from '@/app/actions/leads';

function AplicarConfirmationContent() {
  const searchParams = useSearchParams();
  
  // Extract initial parameters from URL if user completed submission elsewhere
  const paramName = searchParams.get('wl-name') || '';
  const paramCompany = searchParams.get('wl-company') || '';
  const paramScenario = searchParams.get('wl-scenario') || '';

  const hasParams = !!(paramName && paramCompany);

  // Component state
  const [showForm, setShowForm] = useState(hasParams);
  const [wlName, setWlName] = useState(paramName);
  const [wlEmail, setWlEmail] = useState('');
  const [wlCompany, setWlCompany] = useState(paramCompany);
  const [wlRole, setWlRole] = useState('');
  const [wlScenario, setWlScenario] = useState(paramScenario || 'rescue');
  
  const [wlError, setWlError] = useState('');
  const [wlSuccess, setWlSuccess] = useState(hasParams);
  const [loading, setLoading] = useState(false);

  // Email validation helper
  const isCorporateEmail = (email: string) => {
    const freeDomains = [
      'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 
      'icloud.com', 'mail.com', 'live.com', 'msn.com', 
      'yahoo.com.mx', 'live.com.mx', 'hotmail.es', 'yandex.com'
    ];
    const domain = email.toLowerCase().split('@')[1];
    return domain && !freeDomains.includes(domain);
  };

  // Waitlist submission handler
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWlError('');
    setLoading(true);

    if (!isCorporateEmail(wlEmail)) {
      setWlError('Sólo se aceptan correos corporativos.');
      setLoading(false);
      return;
    }

    try {
      const res = await submitWaitlistAction({
        name: wlName,
        email: wlEmail,
        company: wlCompany,
        role: wlRole,
        scenario: wlScenario
      });

      if (res.success) {
        setWlSuccess(true);
      } else {
        setWlError('Error al enviar la solicitud. Intente de nuevo.');
      }
    } catch (err) {
      setWlError('Error de red al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Label resolving helper
  const getScenarioLabel = (sc: string) => {
    if (sc === 'rescue') return 'Rescate de Fusion Cloud';
    if (sc === 'migration') return 'Migración de ERP Legacy';
    if (sc === 'greenfield') return 'Implementación Greenfield';
    return 'Estabilización de Core';
  };

  return (
    <div className="space-y-8 font-mono text-xs">
      
      {/* Navigation & Header */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">/aplicar</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="badge-premium">WAIT LIST</span>
          <span className="text-[10px] text-emerald-500 uppercase font-bold bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded animate-pulse">
            ● CAPACIDAD LÍMITE ACTIVA
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif text-white font-light">
          Registro de Admisión y Control de Capacidad
        </h1>
        <p className="text-zinc-400 font-sans text-sm max-w-3xl leading-relaxed">
          FABRIC opera con un modelo boutique estricto de ingeniería. Limitamos la cantidad de proyectos activos en paralelo para asegurar la intervención directa de ingenieros senior en cada ciclo operativo crítico.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Stats & Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Capacity dashboard card */}
          <div className="card-premium p-6 relative overflow-hidden bg-black border border-zinc-800">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/40" />
            
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-4">CAPACIDAD Y ESTATUS DE INGRESO</span>
            
            {/* Visual Capacity Meter */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center text-[10px] text-zinc-400">
                <span>VOLUMEN OPERATIVO ADMITIDO:</span>
                <span className="font-bold text-accent">11 / 12 PROYECTOS</span>
              </div>
              <div className="h-6 bg-zinc-950 border border-zinc-900 rounded p-1 flex gap-1 font-mono text-[9px] items-center">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-full flex-1 transition-all flex items-center justify-center font-bold ${
                      i < 11 
                        ? 'bg-accent/20 border border-accent/50 text-accent' 
                        : 'bg-red-950/20 border border-red-500/30 text-red-500 animate-pulse'
                    }`}
                  >
                    {i < 11 ? '█' : '1 VACANTE'}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-900 pt-6">
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded">
                <span className="text-zinc-500 block mb-1 text-[9px]">LÍMITE MÁXIMO</span>
                <span className="text-white text-lg font-serif">12 Proyectos</span>
                <span className="text-[10px] text-zinc-600 block mt-1 leading-tight">Garantía de foco</span>
              </div>
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded">
                <span className="text-zinc-500 block mb-1 text-[9px]">PRÓXIMA APERTURA</span>
                <span className="text-white text-lg font-serif">Q3 2026</span>
                <span className="text-[10px] text-zinc-600 block mt-1 leading-tight">Ventana de admisión</span>
              </div>
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded">
                <span className="text-zinc-500 block mb-1 text-[9px]">LISTA DE ESPERA</span>
                <span className="text-emerald-500 text-lg font-serif font-bold">7 Organizadas</span>
                <span className="text-[10px] text-zinc-600 block mt-1 leading-tight">En fila de revisión</span>
              </div>
            </div>

            {/* Scarcity Banner Text */}
            <p className="text-zinc-400 font-sans text-xs mt-6 leading-relaxed border-l-2 border-accent pl-4">
              &quot;FABRIC opera con un máximo de 12 proyectos simultáneos para garantizar entrega en el primer ciclo crítico.&quot;
            </p>
          </div>

          {/* Form or Success State Box */}
          <div className="card-premium p-6 md:p-8 bg-zinc-950/20 border border-zinc-900 rounded relative">
            
            {wlSuccess ? (
              /* Success confirmation view */
              <div className="space-y-6">
                <div className="text-center space-y-3 pb-6 border-b border-zinc-900">
                  <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto" />
                  <h2 className="text-2xl font-serif text-white font-light">
                    Lugar Solicitado en Lista de Espera
                  </h2>
                  <div className="inline-block bg-accent/10 border border-accent/30 text-accent font-bold px-4 py-1.5 text-xs font-mono tracking-widest rounded">
                    PUESTO EN COLA DE ESPERA: #8
                  </div>
                  <p className="text-zinc-500 text-[10px] font-mono block mt-1">
                    REGISTRO ID: FB-WL{Math.floor(1000 + Math.random() * 9000)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-400 font-mono text-xs">
                  <div className="space-y-3">
                    <h4 className="text-accent uppercase font-bold text-[9px] tracking-wider">CREDENCIALES REGISTRADAS:</h4>
                    <div>
                      <span className="text-zinc-600 block">Nombre:</span>
                      <span className="text-white text-sm font-light">{wlName || 'Evaluador'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block">Organización:</span>
                      <span className="text-white text-sm font-light">{wlCompany || 'Empresa Registrada'}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-accent uppercase font-bold text-[9px] tracking-wider">ESTATUS DE REVISIÓN:</h4>
                    <div>
                      <span className="text-zinc-600 block">Escenario:</span>
                      <span className="text-white text-sm font-light">{getScenarioLabel(wlScenario)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block">Estatus de Cola:</span>
                      <span className="text-amber-500 text-sm font-bold">Espera Activa (Priorizada)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-zinc-900">
                  <h4 className="font-mono text-accent text-[9px] uppercase font-bold tracking-wider">SIGUIENTES HITOS TÉCNICOS:</h4>
                  
                  <div className="space-y-3 font-mono text-xs text-zinc-400">
                    <div className="flex items-start gap-3">
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-zinc-200 block font-bold">1. Auditoría de Dominio Corporativo</span>
                        <span>Se ha despachado una solicitud NDA preliminar al correo provisto para verificar patrocinio ejecutivo.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckSquare className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="text-zinc-200 block font-bold">2. Entrevista con Ingeniero Principal</span>
                        <span>Reservar horario de diagnóstico técnico para evaluar la arquitectura de su base de datos.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-900">
                  <Link href="/office-hours" className="btn-primary-accent text-center justify-center flex-1 py-3 text-xs uppercase">
                    Agendar Sesión Técnica <Calendar className="w-4 h-4 ml-1.5" />
                  </Link>
                  <Link href="/" className="btn-outline-accent text-center justify-center py-3 text-xs uppercase">
                    Regresar al Inicio
                  </Link>
                </div>
              </div>
            ) : (
              /* Waitlist submission form view */
              <div className="space-y-6">
                {!showForm ? (
                  /* Call to action screen */
                  <div className="space-y-6 text-center py-6">
                    <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto text-accent mb-2">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-serif text-white font-light">Solicitud de Ingreso a la Cola</h3>
                    <p className="text-zinc-400 font-sans text-xs max-w-sm mx-auto leading-relaxed">
                      El proceso de admisión requiere de un filtro riguroso. Registre su escenario operativo para reservar su lugar en la lista de espera oficial de Q3 2026.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn-primary-accent justify-center w-full max-w-xs mx-auto py-3 text-xs uppercase"
                    >
                      Solicitar lugar en lista de espera <ArrowRight className="w-4 h-4 ml-1.5" />
                    </button>
                  </div>
                ) : (
                  /* Registration Form */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                      <div>
                        <span className="text-accent uppercase tracking-widest text-[9px] block">INGRESO DE DATOS</span>
                        <h3 className="text-base font-serif text-white font-light">Formulario de Cola de Espera</h3>
                      </div>
                      <button
                        onClick={() => {
                          if (!hasParams) setShowForm(false);
                        }}
                        disabled={hasParams}
                        className={`text-zinc-500 hover:text-white transition-colors text-[9px] uppercase border border-zinc-800 px-3 py-1 bg-black/40 ${hasParams ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        ← Volver a Criterios
                      </button>
                    </div>

                    <form onSubmit={handleWaitlistSubmit} className="space-y-4 font-mono text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-zinc-500 block mb-1 text-[9px]">NOMBRE COMPLETO *</label>
                          <input
                            type="text"
                            required
                            value={wlName}
                            onChange={(e) => setWlName(e.target.value)}
                            placeholder="Ej. Ing. Carlos Mendoza"
                            className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-500 block mb-1 text-[9px]">CORREO CORPORATIVO *</label>
                          <input
                            type="email"
                            required
                            value={wlEmail}
                            onChange={(e) => setWlEmail(e.target.value)}
                            placeholder="nombre@empresa.com"
                            className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-zinc-500 block mb-1 text-[9px]">EMPRESA / INSTITUCIÓN *</label>
                          <input
                            type="text"
                            required
                            value={wlCompany}
                            onChange={(e) => setWlCompany(e.target.value)}
                            placeholder="Ej. Seguros Atlas S.A."
                            className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-500 block mb-1 text-[9px]">CARGO / PUESTO *</label>
                          <input
                            type="text"
                            required
                            value={wlRole}
                            onChange={(e) => setWlRole(e.target.value)}
                            placeholder="Ej. CFO / Director TI"
                            className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-zinc-500 block mb-1 text-[9px]">ESCENARIO PRINCIPAL *</label>
                        <select
                          required
                          value={wlScenario}
                          onChange={(e) => setWlScenario(e.target.value)}
                          className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                        >
                          <option value="rescue">Rescate de Fusion Cloud (Prioridad 1 · Estabilización Crítica)</option>
                          <option value="migration">Migración de ERP Legacy (Prioridad 2 · Integración y Flujos)</option>
                          <option value="greenfield">Implementación Greenfield (Prioridad 3 · Arquitectura base)</option>
                        </select>
                      </div>

                      {wlError && (
                        <div className="text-red-500 text-[10px] py-1">
                          * {wlError}
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary-accent w-full justify-center py-3 text-xs uppercase"
                      >
                        {loading ? 'Procesando registro...' : 'Enviar Solicitud de Waitlist'}
                        {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Concept Scorecard & Art */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Concept Diagram ASCII Box */}
          <div className="border border-zinc-800 bg-zinc-950/40 p-4 rounded text-zinc-500 leading-normal font-mono text-[9px] overflow-x-auto whitespace-pre select-text">
{`┌────────────────────────────────────────────────────────┐
│                                                        │
│  /aplicar                                              │
│                                                        │
│  "FABRIC opera con un máximo de 12 proyectos           │
│   simultáneos para garantizar entrega en primer        │
│   ciclo crítico.                                       │
│                                                        │
│   Estado actual: 11 proyectos activos.                 │
│   Próxima ventana de admisión: Q3 2026.                │
│                                                        │
│   Lista de espera actual: 7 organizaciones.            │
│                                                        │
│   [Solicitar lugar en lista de espera →]"              │
│                                                        │
└────────────────────────────────────────────────────────┘`}
          </div>

          {/* Strategic Scorecard why it works pitch */}
          <div className="relative border border-zinc-800 bg-black/40 p-6 space-y-4 rounded">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent/40" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-accent/40" />
            
            <span className="text-[10px] text-accent font-bold uppercase block tracking-wider">── POR QUÉ FUNCIONA ──</span>
            
            <ul className="space-y-3 font-sans text-xs text-zinc-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5 font-bold">·</span>
                <span><strong>Comunica escasez real:</strong> Convierte la contratación de soporte técnico en un activo escaso y prioritario.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5 font-bold">·</span>
                <span><strong>Justifica precio premium:</strong> Al fijar un tope, el mercado asume de manera natural el costo del servicio sin discusiones de tarifa horaria.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5 font-bold">·</span>
                <span><strong>Filtra prospectos no comprometidos:</strong> Las empresas sin urgencia real o presupuesto no asumen el esfuerzo de ingresar a una lista de espera corporativa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5 font-bold">·</span>
                <span><strong>Crea FOMO operativo:</strong> Despierta la necesidad de asegurar slots antes de que los competidores cierren las ventanas de admisión anuales.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5 font-bold">·</span>
                <span><strong>Te posiciona como recurso escaso:</strong> Transforma la percepción de FABRIC de un proveedor dependiente a un recurso de ingeniería de élite altamente selectivo.</span>
              </li>
            </ul>
          </div>

          {/* Operational requirements discipline block */}
          <div className="border border-zinc-900 bg-zinc-950/40 p-4 rounded text-zinc-500 font-sans text-xs leading-relaxed space-y-2">
            <span className="font-mono text-[10px] text-red-500 font-bold flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" /> REQUISITOS OPERATIVOS
            </span>
            <ul className="space-y-1.5 font-mono text-[10px] text-zinc-500">
              <li className="flex items-start gap-2">
                <span className="text-zinc-700">·</span>
                <span>Que los números mostrados sean completamente reales.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-700">·</span>
                <span>Disciplina operativa estricta de no aceptar más allá del cap de 12 proyectos.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function AplicarConfirmation() {
  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={
          <div className="card-premium p-6 text-center space-y-4 font-mono text-xs text-zinc-500">
            <p>Cargando información del panel de lista de espera...</p>
          </div>
        }>
          <AplicarConfirmationContent />
        </Suspense>
      </div>
    </div>
  );
}
