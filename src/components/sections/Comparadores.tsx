import React from 'react';

interface ComparadoresProps {
  setActiveOverlayModal: (modal: 'erp' | 'cloud' | 'diagnostico' | 'office-hours' | 'ape-plazas' | 'aplazo' | 'doctrina' | 'transparencia' | null) => void;
}

export default function Comparadores({ setActiveOverlayModal }: ComparadoresProps) {
  return (
    <section id="comparadores" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="max-w-2xl mb-12 reveal-on-scroll">
          <span className="badge-premium mb-3 inline-block">COMPARATIVE ENGINE</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light mb-4">
            ¿Cuánto dinero estás dejando ir hoy? <span className="text-accent">Descubre tu ahorro real en Oracle.</span>
          </h2>
          <p className="text-zinc-400 text-base">
            No creemos en calculadoras genéricas con números ficticios. Diseñamos herramientas para proyectar el costo total de propiedad (TCO) y ahorro de migración con datos de tu propia factura e infraestructura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal-on-scroll">
          <div className="card-premium p-6 md:p-8 flex flex-col justify-between h-full">
            <div>
              <span className="badge-premium mb-4 inline-block">Herramienta 1</span>
              <h3 className="text-2xl font-serif text-white font-light mb-3">ERP TCO Comparator</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Compara los costos actuales de licencias, mantenimiento, infraestructura física y consultores de soporte de tu ERP actual (SAP S/4 HANA, ECC, EBS R12, JD Edwards, Dynamics) frente a la estructura optimizada y consolidada de Oracle Fusion Cloud.
              </p>
              <ul className="space-y-2 font-mono text-xs text-zinc-500 mb-8">
                <li><span className="text-accent mr-2">✓</span> Proyección financiera a 3, 5 y 10 años</li>
                <li><span className="text-accent mr-2">✓</span> Evaluación de costos de base de datos oculta</li>
                <li><span className="text-accent mr-2">✓</span> Estimación de ROI y mes exacto de breakeven</li>
              </ul>
            </div>
            <button 
              type="button" 
              onClick={() => setActiveOverlayModal('erp')} 
              className="btn-primary-accent text-center justify-center cursor-pointer"
            >
              Calcular TCO Actual
            </button>
          </div>

          <div className="card-premium p-6 md:p-8 flex flex-col justify-between h-full">
            <div>
              <span className="badge-premium mb-4 inline-block">Herramienta 2</span>
              <h3 className="text-2xl font-serif text-white font-light mb-3">Cloud Cost Comparator</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Si ejecutas workloads y ERPs críticos en AWS, Azure o Google Cloud, calcula cuánto ahorrarías en hosting, red y almacenamiento al migrar la infraestructura base de tus aplicaciones directamente a Oracle Cloud Infrastructure (OCI).
              </p>
              <ul className="space-y-2 font-mono text-xs text-zinc-500 mb-8">
                <li><span className="text-accent mr-2">✓</span> Mapeo de equivalencia (Compute, S3/EBS, RDS)</li>
                <li><span className="text-accent mr-2">✓</span> Análisis de costos de transferencia de salida (Egress)</li>
                <li><span className="text-accent mr-2">✓</span> Proyección de ROI de migración de infraestructura</li>
              </ul>
            </div>
            <button 
              type="button" 
              onClick={() => setActiveOverlayModal('cloud')} 
              className="btn-outline-accent text-center justify-center cursor-pointer"
            >
              Comparar Costo Cloud
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
