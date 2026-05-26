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
          <div className="card-premium p-6 flex flex-col justify-between h-full">
            <div>
              <span className="badge-premium mb-3 inline-block">RESEARCH NOTE</span>
              <h3 className="text-lg font-serif text-white mb-3">Por qué fallan los go-live de Oracle Fusion</h3>
              <p className="text-zinc-500 text-xs mb-6">Análisis de patrones de fracaso en implementaciones LATAM, causas raíz en incentivos y propuesta de modelo alternativo de estabilización.</p>
            </div>
            <button 
              onClick={() => setActivePaper('Por qué fallan los go-live de Oracle Fusion')}
              className="btn-outline-accent !py-2 justify-center w-full cursor-pointer text-xs"
            >
              Descargar Paper
            </button>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between h-full">
            <div>
              <span className="badge-premium mb-3 inline-block">TECHNICAL FRAMEWORK</span>
              <h3 className="text-lg font-serif text-white mb-3">IA aplicada a cierre contable en Fusion Cloud</h3>
              <p className="text-zinc-500 text-xs mb-6">Framework técnico de capas para conciliación inteligente, predicción de partidas pendientes y automatización de reportes de cierre.</p>
            </div>
            <button 
              onClick={() => setActivePaper('IA aplicada a cierre contable en Fusion Cloud')}
              className="btn-outline-accent !py-2 justify-center w-full cursor-pointer text-xs"
            >
              Descargar Paper
            </button>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between h-full">
            <div>
              <span className="badge-premium mb-3 inline-block">DOCTRINA OPERATIVA</span>
              <h3 className="text-lg font-serif text-white mb-3">Modelo de entrega en primer ciclo crítico</h3>
              <p className="text-zinc-500 text-xs mb-6">Doctrina contractual y operativa de hitos de pago alineados a la estabilización real durante el primer ciclo financiero u operativo.</p>
            </div>
            <button 
              onClick={() => setActivePaper('Modelo de entrega en primer ciclo crítico')}
              className="btn-outline-accent !py-2 justify-center w-full cursor-pointer text-xs"
            >
              Descargar Paper
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
