import React, { useState } from 'react';

export default function FabricOS() {
  const [activeOSLayer, setActiveOSLayer] = useState(1);

  return (
    <section id="fabricos" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6 reveal-on-scroll">
            <span className="badge-premium mb-3 inline-block">FABRIC OS</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light">
              <span className="text-accent">Deja de parchar tu ERP</span>: Corrige deficiencias críticas sin corromper tu núcleo estándar.
            </h2>
            <p className="text-zinc-400 text-sm">
              Diseñamos integraciones y reportes encapsulados sobre Oracle Cloud para solucionar deficiencias críticas sin corromper el núcleo estándar del ERP.
            </p>

            {/* Layer details */}
            <div className="p-6 bg-zinc-950 border border-accent/20">
              <span className="text-[10px] font-mono text-zinc-500 block mb-2">DETALLE DEL NIVEL SELECCIONADO:</span>
              {activeOSLayer === 1 && (
                <div>
                  <h4 className="font-mono text-white text-sm font-bold">Capa 1: Ingesta Bancaria Automatizada</h4>
                  <p className="text-zinc-400 text-xs mt-2">Conectores Host-to-Host directos con bancos mexicanos para conciliar cobros automáticamente.</p>
                </div>
              )}
              {activeOSLayer === 2 && (
                <div>
                  <h4 className="font-mono text-white text-sm font-bold">Capa 2: Subledgers en Base de Datos</h4>
                  <p className="text-zinc-400 text-xs mt-2">Remediación de la velocidad del Libro de Cuentas por Cobrar mediante optimización de consultas SQL.</p>
                </div>
              )}
              {activeOSLayer === 3 && (
                <div>
                  <h4 className="font-mono text-white text-sm font-bold">Capa 3: Integración Fiscal CFDI 4.0</h4>
                  <p className="text-zinc-400 text-xs mt-2">Emisión y timbrado masivo directamente desde el ERP con validaciones SAT integradas.</p>
                </div>
              )}
              {activeOSLayer === 4 && (
                <div>
                  <h4 className="font-mono text-white text-sm font-bold">Capa 4: Cierres Contables Automatizados</h4>
                  <p className="text-zinc-400 text-xs mt-2">Reporteadores en tiempo real que consolidan datos listos para auditorías externas.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-3 font-mono reveal-on-scroll reveal-delay-200">
            <div 
              className={`os-layer-bar ${activeOSLayer === 1 ? 'active' : ''}`}
              onClick={() => setActiveOSLayer(1)}
            >
              <span className="text-xs text-accent block">Nivel 01 / CONECTIVIDAD BANCARIA</span>
              <span className="text-white text-sm block font-bold mt-1">Conector Host-to-Host H2H</span>
            </div>

            <div 
              className={`os-layer-bar ${activeOSLayer === 2 ? 'active' : ''}`}
              onClick={() => setActiveOSLayer(2)}
            >
              <span className="text-xs text-accent block">Nivel 02 / PROCESAMIENTO</span>
              <span className="text-white text-sm block font-bold mt-1">Base de Datos Oracle & SLA Engine</span>
            </div>

            <div 
              className={`os-layer-bar ${activeOSLayer === 3 ? 'active' : ''}`}
              onClick={() => setActiveOSLayer(3)}
            >
              <span className="text-xs text-accent block">Nivel 03 / LOCALIZACIÓN</span>
              <span className="text-white text-sm block font-bold mt-1">Facturación SAT CFDI 4.0 Connector</span>
            </div>

            <div 
              className={`os-layer-bar ${activeOSLayer === 4 ? 'active' : ''}`}
              onClick={() => setActiveOSLayer(4)}
            >
              <span className="text-xs text-accent block">Nivel 04 / CONCILIACIÓN</span>
              <span className="text-white text-sm block font-bold mt-1">Libro Mayor (GL) Reporting Engine</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
