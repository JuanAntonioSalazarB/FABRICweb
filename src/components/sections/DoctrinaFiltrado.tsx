import React from 'react';

export default function DoctrinaFiltrado() {
  const exclusions = [
    "No PYMES sin compliance regulatorio",
    "No outsourcing por horas",
    "No mantenimiento preventivo simple",
    "No proyectos sin patrocinio CFO/CTO"
  ];

  return (
    <section id="doctrina-filtrado" className="py-24 border-b border-[rgba(201,169,110,0.15)] bg-black font-mono text-xs">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Main Containment Box with Premium Retro-Tech styling */}
        <div className="relative card-premium p-8 md:p-14 bg-zinc-950/40 border border-zinc-800 reveal-on-scroll overflow-hidden">
          {/* Subtle gradient wash */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(201,169,110,0.06)] via-transparent to-transparent" />
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/60" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent/60" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent/60" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/60" />

          {/* Section Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10 relative">
            <div className="md:col-span-7">
              <span className="badge-premium mb-4 inline-block">FILTRO DE ADMISIÓN</span>
              <h2 className="text-4xl md:text-6xl font-serif text-white font-light tracking-tight leading-[0.98]">
                No somos para todos.
              </h2>
            </div>

            <div className="md:col-span-5 md:pt-3">
              <div className="border border-[rgba(201,169,110,0.16)] bg-black/30 p-5 md:p-6">
                <p className="text-zinc-300 text-sm md:text-base font-sans leading-relaxed">
                  Operamos con un número limitado de proyectos por año para garantizar entrega real en primer ciclo crítico.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-[1px] w-full bg-accent/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/70 shrink-0" />
                  <div className="h-[1px] w-full bg-accent/20" />
                </div>
                <p className="mt-3 text-[10px] md:text-[11px] text-zinc-500 font-mono leading-relaxed">
                  Si tu iniciativa no cae en el perfil, preferimos decir “no” temprano antes de generar deuda operativa.
                </p>
              </div>
            </div>
          </div>

          {/* Exclusions Container */}
          <div className="max-w-3xl mx-auto">
            <div className="border border-[rgba(201,169,110,0.12)] bg-zinc-950/50 divide-y divide-[rgba(201,169,110,0.08)]">
              {exclusions.map((exclusion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 px-5 py-4 md:px-6 md:py-5 hover:bg-black/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-accent text-[11px] font-mono font-bold tracking-widest select-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-accent/80 text-lg font-bold select-none leading-none transition-transform duration-300 group-hover:scale-110">
                      ⊗
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-zinc-200 font-sans text-sm md:text-base font-light leading-snug group-hover:text-white transition-colors">
                      {exclusion}
                    </span>
                    <div className="mt-2 h-[1px] w-full bg-[rgba(201,169,110,0.08)]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <span className="text-[10px] md:text-[11px] text-zinc-500 font-mono">
                Resultado: menos promesas, más entrega.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
