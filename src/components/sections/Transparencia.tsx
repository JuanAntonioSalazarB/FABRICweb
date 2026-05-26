import React from 'react';
import Link from 'next/link';

interface TransparenciaProps {
  setActiveOverlayModal: (modal: 'erp' | 'cloud' | 'diagnostico' | 'office-hours' | 'ape-plazas' | 'aplazo' | 'doctrina' | 'transparencia' | null) => void;
}

export default function Transparencia({ setActiveOverlayModal }: TransparenciaProps) {
  const metrics = [
    { label: "Proyectos entregados en primer ciclo crítico", value: "18", unit: "" },
    { label: "Proyectos dentro de presupuesto Fixed-Price", value: "100", unit: "%" },
    { label: "NPS clientes activos", value: "96", unit: "" },
    { label: "Retención clientes a 24 meses", value: "98", unit: "%" },
    { label: "Tiempo medio de respuesta crítico", value: "< 15", unit: " min" },
    { label: "Senior consultants en plantilla", value: "100", unit: "%" },
  ];

  return (
    <section id="transparencia" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950 font-mono text-xs">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start reveal-on-scroll">
                  {/* Left Column - Information */}
          <div className="lg:col-span-5 space-y-6">
            <span className="badge-premium mb-3 inline-block">TRANSPARENCIA</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light tracking-tight font-sans leading-none">
              ¿Estás aceptando promesas sin garantías? <span className="text-accent">Descubre los indicadores reales que tu proveedor no se atreve a publicar.</span>
            </h2>
            <p className="text-zinc-500 font-sans leading-relaxed text-sm">
              Publicamos de forma proactiva nuestros indicadores clave de éxito. Creemos en la auditoría abierta de procesos y en el respaldo empírico de cada garantía contractual.
            </p>
            
            <div className="pt-4 border-t border-zinc-900 space-y-3">
              <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                <span>Última actualización:</span>
                <span className="text-zinc-300">Q1 2026</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setActiveOverlayModal('transparencia')} 
              className="link-fancy block text-xs pt-2 w-fit text-left cursor-pointer"
            >
              Ver detalle metodológico
            </button>
          </div>

          {/* Right Column - Table/Console of Metrics */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border border-zinc-800/80 bg-zinc-950/60 rounded overflow-hidden backdrop-blur-sm">
              {/* Header of the table */}
              <div className="grid grid-cols-12 gap-2 bg-zinc-900/40 px-5 py-4 border-b border-zinc-850 text-[10px] tracking-wider text-zinc-500 font-mono uppercase">
                <div className="col-span-8 sm:col-span-7">Indicador de Rendimiento</div>
                <div className="col-span-4 sm:col-span-3 text-right">Valor Auditado</div>
                <div className="hidden sm:block sm:col-span-2 text-right">Estado</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-zinc-900">
                {metrics.map((m, idx) => {
                  let badge = "";
                  let progressValue = 0;
                  
                  if (m.label.includes("primer ciclo")) {
                    badge = "CICLO CRÍTICO";
                  } else if (m.label.includes("Fixed-Price")) {
                    badge = "GARANTÍA TCO";
                    progressValue = 100;
                  } else if (m.label.includes("NPS")) {
                    badge = "SATISFACCIÓN";
                    progressValue = 96;
                  } else if (m.label.includes("Retención")) {
                    badge = "LEALTAD LTV";
                    progressValue = 98;
                  } else if (m.label.includes("respuesta")) {
                    badge = "SLA MÁXIMO";
                  } else if (m.label.includes("Senior")) {
                    badge = "TALENTO CORE";
                    progressValue = 100;
                  }

                  return (
                    <div 
                      key={idx} 
                      className="grid grid-cols-12 gap-2 px-5 py-4 items-center hover:bg-zinc-900/20 transition-all duration-200 group relative"
                    >
                      {/* Left hover border accent */}
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                      
                      {/* Column 1: Label & Category Badge */}
                      <div className="col-span-8 sm:col-span-7 space-y-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono text-zinc-600 group-hover:text-accent transition-colors">
                            // {badge}
                          </span>
                        </div>
                        <h4 className="text-zinc-300 group-hover:text-white font-sans text-xs leading-normal font-light transition-colors">
                          {m.label}
                        </h4>
                      </div>

                      {/* Column 2: Audited Value & Mini progress indicator */}
                      <div className="col-span-4 sm:col-span-3 text-right space-y-1.5">
                        <div className="flex items-baseline justify-end">
                          <span className="text-accent text-xl font-bold font-mono tracking-tight group-hover:text-white transition-colors duration-300">
                            {m.value}
                          </span>
                          {m.unit && (
                            <span className="text-zinc-500 text-xs font-mono ml-0.5">
                              {m.unit}
                            </span>
                          )}
                        </div>
                        
                        {/* Compact Visual progress bar */}
                        {progressValue > 0 ? (
                          <div className="h-[2px] bg-zinc-900 w-20 ml-auto rounded overflow-hidden">
                            <div 
                              className="h-full bg-accent/40 group-hover:bg-accent transition-all duration-500"
                              style={{ width: `${progressValue}%` }}
                            />
                          </div>
                        ) : (
                          // For non-percentage values, display a subtle tag
                          <div className="text-[8px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">
                            {m.label.includes("respuesta") ? "LIMIT CUMPLIDO" : "18 PROYECTOS"}
                          </div>
                        )}
                      </div>

                      {/* Column 3: Audit Badge */}
                      <div className="col-span-12 sm:col-span-2 text-right mt-2 sm:mt-0 flex sm:justify-end">
                        <span className="text-[8px] font-mono text-emerald-500 bg-emerald-950/20 border border-emerald-900/60 px-1.5 py-0.5 rounded tracking-wider uppercase font-semibold">
                          ✓ AUDITED
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Terminal status line at bottom */}
            <div className="p-3 bg-zinc-950 border border-zinc-800/60 text-[9px] text-zinc-500 font-mono flex items-center justify-between rounded">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SYSTEM: INDICATORS SYNCED WITH BLOCKCHAIN AUDIT LOG
              </span>
              <span className="text-zinc-600">v1.0.1_STABLE</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
