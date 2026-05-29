import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface AgendaCitaProps {
  setActiveOverlayModal: (modal: 'diagnostico' | 'office-hours' | 'ape-plazas' | 'aplazo' | 'doctrina' | 'transparencia' | null) => void;
}

export default function AgendaCita({ setActiveOverlayModal }: AgendaCitaProps) {
  return (
    <section id="agenda" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* FOMO System Status Alert Banner */}
        <div className="mb-12 p-4 md:p-6 border border-accent/25 bg-zinc-950/45 rounded-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 reveal-on-scroll shadow-[0_0_20px_rgba(201,169,110,0.04)]">
          {/* Esquinas consola */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/40" />

          {/* Left: Capacity and Blinking Dot */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <span className="font-mono text-[9px] text-accent uppercase tracking-widest">[ RADAR DE ADMISIÓN CRÍTICA ]</span>
                <span className="font-mono text-[9px] text-red-500 font-bold uppercase tracking-wider animate-blink">¡ADVERTENCIA DE CAPACIDAD!</span>
              </div>
              <h3 className="text-xs md:text-sm font-mono text-white font-bold uppercase tracking-wider">
                11 de 12 Slots de Ingeniería Ocupados
              </h3>
            </div>
          </div>

          {/* Center: Grid blocks indicating capacity */}
          <div className="flex items-center gap-1.5 py-1.5 px-3 bg-black/60 border border-zinc-900 rounded">
            <div className="flex gap-1">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="w-2 h-3.5 bg-accent/80 border border-accent/20" />
              ))}
              <div className="w-2 h-3.5 bg-zinc-900 border border-zinc-800 animate-pulse" />
            </div>
            <span className="font-mono text-[10px] text-zinc-400 pl-2">1 Libre</span>
          </div>

          {/* Right: Waitlist status & CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end text-center sm:text-left">
            <div className="font-mono text-[10px] text-zinc-500">
              <div>WAITLIST: <span className="text-white font-bold">7 COMPAÑÍAS</span></div>
              <div>PRÓXIMA APERTURA: <span className="text-accent font-bold">Q4 2026</span></div>
            </div>
            <a 
              href="#admision" 
              className="btn-primary-accent !py-2 !px-4 text-[10px] uppercase font-mono w-full sm:w-auto text-center"
            >
              [ APLICAR A WAITLIST ]
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and Context */}
          <div className="lg:col-span-7 space-y-6 reveal-on-scroll">
            <span className="badge-premium mb-3 inline-block">MESA TÉCNICA 1-ON-1</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light leading-tight">
              Detén los errores ocultos en tu arquitectura antes de que <span className="text-accent">congelen tu operación hoy mismo.</span>
            </h2>
            <p className="text-zinc-400 text-sm">
              Conversa directamente con un Ingeniero Principal de FABRIC. Evaluamos los riesgos reales, cuellos de botella de integraciones y arquitectura de tu proyecto Oracle Fusion. Sin rodeos comerciales, sin presentaciones de ventas corporativas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-zinc-500 pt-4">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-zinc-300 text-xs font-bold uppercase">Disponibilidad Dinámica</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Elige un día y horario en tiempo real de los bloques abiertos por administración.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-zinc-300 text-xs font-bold uppercase">Sesión Privada de 30 Min</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Análisis técnico preliminar, revisión de NDA y asignación de cola de admisión.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: CTA Block */}
          <div className="lg:col-span-5 reveal-on-scroll reveal-delay-200">
            <div className="p-8 border border-zinc-800 bg-zinc-950/40 rounded-2xl relative space-y-6 text-center shadow-[0_0_20px_rgba(201,169,110,0.02)]">
              {/* Esquinas decorativas consola */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent/30" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-accent/30" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-accent/30" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-accent/30" />

              <div className="mx-auto w-12 h-12 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-accent" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-mono text-white font-bold uppercase tracking-wider">Agendar Sesión Técnica</h3>
                <p className="text-[10px] text-zinc-500 max-w-xs mx-auto leading-normal">
                  Se requiere dirección de correo electrónico corporativo para agendar y bloquear el horario seleccionado.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveOverlayModal('office-hours')}
                className="btn-primary-accent w-full justify-center gap-2 text-[10px] uppercase font-bold py-3 mt-2 shadow-[0_0_15px_rgba(201,169,110,0.1)] hover:shadow-[0_0_25px_rgba(201,169,110,0.2)] font-mono"
              >
                [ AGENDAR CITA DE INGENIERÍA ]
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
