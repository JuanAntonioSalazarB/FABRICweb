import React from 'react';

interface InvestigacionProps {
  setActivePaper: (paper: string | null) => void;
}

export default function Investigacion({ setActivePaper }: InvestigacionProps) {
  return (
    <section id="investigacion" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="mb-12 reveal-on-scroll">
          <span className="badge-premium mb-3 inline-block">INVESTIGACIÓN</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light mb-4">
            <span className="text-accent">Lo que tu equipo técnico está ignorando</span> sobre las localizaciones del SAT y bases de datos Oracle.
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            Publicamos guías operativas detallando los mecanismos de base de datos y localizaciones SAT para que tu equipo técnico interno los implemente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-on-scroll">
          <div className="card-premium p-6 md:p-7 flex flex-col h-full hover:border-accent/40 transition-all duration-300 group">
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="badge-premium inline-block">RESEARCH NOTE</span>
              <span className="text-[10px] text-zinc-600 font-mono tracking-wider">PAPER 01</span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-white font-light leading-tight mb-3 group-hover:text-accent transition-colors">
              Por qué fallan los go-live de Oracle Fusion
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
              Análisis de patrones de fracaso en implementaciones LATAM, causas raíz en incentivos y propuesta de modelo alternativo de estabilización.
            </p>
            <div className="pt-5 border-t border-[rgba(201,169,110,0.12)]">
              <button
                onClick={() => setActivePaper('Por qué fallan los go-live de Oracle Fusion')}
                className="btn-outline-accent !py-2.5 justify-center w-full cursor-pointer text-xs uppercase tracking-wider"
              >
                Descargar Paper
              </button>
              <span className="block mt-3 text-[10px] text-zinc-600 font-mono">
                Acceso gated · entrega por correo corporativo
              </span>
            </div>
          </div>

          <div className="card-premium p-6 md:p-7 flex flex-col h-full hover:border-accent/40 transition-all duration-300 group">
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="badge-premium inline-block">TECHNICAL FRAMEWORK</span>
              <span className="text-[10px] text-zinc-600 font-mono tracking-wider">PAPER 02</span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-white font-light leading-tight mb-3 group-hover:text-accent transition-colors">
              IA aplicada a cierre contable en Fusion Cloud
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
              Framework técnico de capas para conciliación inteligente, predicción de partidas pendientes y automatización de reportes de cierre.
            </p>
            <div className="pt-5 border-t border-[rgba(201,169,110,0.12)]">
              <button
                onClick={() => setActivePaper('IA aplicada a cierre contable en Fusion Cloud')}
                className="btn-outline-accent !py-2.5 justify-center w-full cursor-pointer text-xs uppercase tracking-wider"
              >
                Descargar Paper
              </button>
              <span className="block mt-3 text-[10px] text-zinc-600 font-mono">
                Incluye arquitectura por capas + checklist de implementación
              </span>
            </div>
          </div>

          <div className="card-premium p-6 md:p-7 flex flex-col h-full hover:border-accent/40 transition-all duration-300 group">
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="badge-premium inline-block">DOCTRINA OPERATIVA</span>
              <span className="text-[10px] text-zinc-600 font-mono tracking-wider">PAPER 03</span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-white font-light leading-tight mb-3 group-hover:text-accent transition-colors">
              Modelo de entrega en primer ciclo crítico
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
              Doctrina contractual y operativa de hitos de pago alineados a la estabilización real durante el primer ciclo financiero u operativo.
            </p>
            <div className="pt-5 border-t border-[rgba(201,169,110,0.12)]">
              <button
                onClick={() => setActivePaper('Modelo de entrega en primer ciclo crítico')}
                className="btn-outline-accent !py-2.5 justify-center w-full cursor-pointer text-xs uppercase tracking-wider"
              >
                Descargar Paper
              </button>
              <span className="block mt-3 text-[10px] text-zinc-600 font-mono">
                Entregables + hitos + cláusulas de estabilización
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
