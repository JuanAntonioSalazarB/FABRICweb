import React from 'react';

interface DoctrinaProps {
  setActiveOverlayModal: (modal: 'erp' | 'cloud' | 'diagnostico' | 'office-hours' | 'ape-plazas' | 'aplazo' | 'doctrina' | 'transparencia' | null) => void;
}

export default function Doctrina({ setActiveOverlayModal }: DoctrinaProps) {
  return (
    <section id="doctrina" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8 reveal-on-scroll">
            <span className="badge-premium mb-3 inline-block">DOCTRINA OPERATIVA</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light leading-tight">
              <span className="text-accent">Deja de pagar por PowerPoints y horas muertas</span> mientras tu producción sigue inestable.
            </h2>
            <p className="text-zinc-400 text-sm">
              Nuestra práctica se basa en 5 compromisos no negociables. No facturamos metodologías ni horas-hombre en powerpoints; facturamos software estabilizado en producción.
            </p>

            <div className="space-y-6 font-mono text-zinc-400">
              <div className="flex gap-4 border-b border-[rgba(201,169,110,0.08)] pb-4">
                <span className="text-accent text-lg">01</span>
                <div>
                  <h4 className="text-white text-sm font-bold">Entrega en primer ciclo crítico</h4>
                  <p className="text-xs text-zinc-500 mt-1">El proyecto no se entrega en el go-live. Se entrega cuando tu primer cierre contable, primer ciclo operativo o primer ciclo regulatorio crítico opera en producción con estabilidad documentada.</p>
                </div>
              </div>

              <div className="flex gap-4 border-b border-[rgba(201,169,110,0.08)] pb-4">
                <span className="text-accent text-lg">02</span>
                <div>
                  <h4 className="text-white text-sm font-bold">Solo seniors. Cero juniors facturables.</h4>
                  <p className="text-xs text-zinc-500 mt-1">Cada consultor de FABRIC tiene mínimo 8 años de experiencia real en Oracle. Sin excepciones.</p>
                </div>
              </div>

              <div className="flex gap-4 border-b border-[rgba(201,169,110,0.08)] pb-4">
                <span className="text-accent text-lg">03</span>
                <div>
                  <h4 className="text-white text-sm font-bold">Fixed-Price por fase. Cero sorpresas.</h4>
                  <p className="text-xs text-zinc-500 mt-1">Operamos con presupuestos cerrados. Si nos atrasamos por nuestra causa, no facturamos las semanas adicionales.</p>
                </div>
              </div>

              <div className="flex gap-4 border-b border-[rgba(201,169,110,0.08)] pb-4">
                <span className="text-accent text-lg">04</span>
                <div>
                  <h4 className="text-white text-sm font-bold">Cero reportes manuales post go-live.</h4>
                  <p className="text-xs text-zinc-500 mt-1">Al cierre del primer ciclo crítico, ningún reporte ejecutivo, financiero u operativo debe ejecutarse fuera del ERP. Si subsiste un reporte manual paralelo por causa atribuible a FABRIC, se resuelve sin costo adicional hasta su eliminación.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-accent text-lg">05</span>
                <div>
                  <h4 className="text-white text-sm font-bold">Transición formal con documentación viva.</h4>
                  <p className="text-xs text-zinc-500 mt-1">El cierre del proyecto se documenta con acta formal firmada por todos los stakeholders del cliente. El acta incluye: tablero de KPIs verificado, incidencias resueltas, adopción de usuarios clave medida, plan de soporte post-transición, y entrega de documentación viva (configuraciones, integraciones, runbooks, procedimientos de cierre, matrices de roles) auditable y actualizable por el cliente sin dependencia de FABRIC.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-10 reveal-on-scroll reveal-delay-200">
            <div className="sticky top-28 p-6 md:p-8 border-2 border-accent bg-accent/5 space-y-6">
              <span className="badge-premium mb-4">Garantía Contractual</span>
              <h3 className="text-xl md:text-2xl font-serif text-white font-light italic">
                &quot;Si no logramos estabilizar tu primer cierre contable en producción en la fecha acordada por causas de nuestra ingeniería, no facturamos los servicios de estabilización hasta lograrlo.&quot;
              </h3>
              <p className="font-mono text-zinc-500 text-xs">
                — Cláusula 7.2 del Contrato de Prestación de Servicios FABRIC
              </p>
              <button 
                type="button" 
                onClick={() => setActiveOverlayModal('doctrina')} 
                className="link-fancy block text-xs w-fit text-left cursor-pointer"
              >
                Ver doctrina detallada
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
