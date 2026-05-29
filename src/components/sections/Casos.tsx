import React from 'react';

interface CasosProps {
  setActiveOverlayModal: (modal: 'diagnostico' | 'office-hours' | 'ape-plazas' | 'aplazo' | 'doctrina' | 'transparencia' | null) => void;
}

export default function Casos({ setActiveOverlayModal }: CasosProps) {
  return (
    <section id="casos" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="mb-12 reveal-on-scroll">
          <span className="badge-premium mb-3 inline-block">CASOS ANCLA</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light mb-4">
            Evita las fallas catastróficas que otros ya resolvieron: <span className="text-accent">Mira cómo rescatamos sistemas core reales.</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            No publicamos logotipos sin contexto corporativo ni casos de éxito vagos. A continuación se presentan dos remediaciones de alta complejidad completadas por nuestro equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 reveal-on-scroll">
          <div className="card-premium p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="badge-premium mb-4">Inmobiliario / Retail</span>
              <h3 className="text-2xl font-serif text-white mb-4">Caso APE Plazas</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Implementación integral y remediación post-migración del módulo de facturación masiva de arrendamientos y contabilidad general en Oracle Fusion Cloud para el operador líder de centros comerciales.
              </p>
              
              <div className="overflow-x-auto w-full mb-6">
                <table className="w-full text-left border-collapse border border-zinc-800 text-xs font-mono">
                  <thead>
                    <tr className="border-b border-zinc-800 text-accent">
                      <th className="p-3">Métrica de Control</th>
                      <th className="p-3">Cumplimiento</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-400">
                    <tr className="border-b border-zinc-800">
                      <td className="p-3">Go-Live Contractual</td>
                      <td className="p-3 text-emerald-500">✓ 06 Abril 2026</td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="p-3">Primer Cierre Ejecutado</td>
                      <td className="p-3 text-emerald-500">✓ 30 Abril 2026</td>
                    </tr>
                    <tr>
                      <td className="p-3">Incidencias Críticas</td>
                      <td className="p-3 text-emerald-500">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <blockquote className="border-l border-accent pl-4 text-xs text-zinc-500 italic mb-6">
                &quot;El cierre contable de abril se ejecutó sin incidencias con acompañamiento FABRIC en sitio. Ese es el momento en el que consideramos el proyecto realmente entregado.&quot;
              </blockquote>
            </div>
            <button 
              type="button" 
              onClick={() => setActiveOverlayModal('ape-plazas')} 
              className="btn-primary-accent w-full text-center justify-center cursor-pointer"
            >
              Ver Paper Técnico
            </button>
          </div>

          <div className="card-premium p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="badge-premium mb-4">Fintech</span>
              <h3 className="text-2xl font-serif text-white mb-4">Caso Aplazo</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Estabilización de interfaces de cobros recurrentes y conciliación automática del auxiliar de Cuentas por Cobrar con el Libro Mayor (GL) en un plazo récord de 8 semanas.
              </p>

              <div className="overflow-x-auto w-full mb-6">
                <table className="w-full text-left border-collapse border border-zinc-800 text-xs font-mono">
                  <thead>
                    <tr className="border-b border-zinc-800 text-accent">
                      <th className="p-3">Métrica de Control</th>
                      <th className="p-3">Cumplimiento</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-400">
                    <tr className="border-b border-zinc-800">
                      <td className="p-3">Plazo de Estabilización</td>
                      <td className="p-3 text-emerald-500">✓ 8 semanas (Logrado)</td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="p-3">Monto Transaccionado</td>
                      <td className="p-3 text-emerald-500">✓ $4.2B MXN / mes</td>
                    </tr>
                    <tr>
                      <td className="p-3">Cierres Paralelos Reducidos</td>
                      <td className="p-3 text-emerald-500">De 5 días a 4 horas</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <blockquote className="border-l border-accent pl-4 text-xs text-zinc-500 italic mb-6">
                &quot;La arquitectura de bases de datos diseñada por FABRIC nos permitió cuadrar la contabilidad general de forma automática directamente en el ERP.&quot;
              </blockquote>
            </div>
            <button 
              type="button" 
              onClick={() => setActiveOverlayModal('aplazo')} 
              className="btn-primary-accent w-full text-center justify-center cursor-pointer"
            >
              Ver Paper Técnico
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
