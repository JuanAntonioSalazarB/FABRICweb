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
        <div className="relative card-premium p-8 md:p-16 bg-zinc-950/40 border border-zinc-800 reveal-on-scroll">
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/60" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent/60" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent/60" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/60" />

          {/* Section Header */}
          <div className="text-center space-y-4 mb-12">
            <span className="badge-premium mb-2 inline-block">SECCIÓN 11 · DOCTRINA DE FILTRADO</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white font-light tracking-tight font-sans">
              No somos para todos.
            </h2>
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto py-2">
              <div className="h-[1px] w-full bg-accent/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
              <div className="h-[1px] w-full bg-accent/20" />
            </div>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto font-sans leading-relaxed">
              Operamos con un número limitado de proyectos por año para garantizar entrega real en primer ciclo crítico.
            </p>
          </div>

          {/* Exclusions Container */}
          <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exclusions.map((exclusion, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-4 border border-[rgba(201,169,110,0.06)] bg-zinc-950/60 hover:border-accent/30 hover:bg-zinc-950/90 transition-all duration-300 group"
              >
                <span className="text-accent text-lg font-bold select-none leading-none pt-0.5 transition-transform duration-300 group-hover:scale-125">
                  ⊗
                </span>
                <span className="text-zinc-400 font-sans text-xs md:text-sm leading-snug group-hover:text-white transition-colors">
                  {exclusion}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
