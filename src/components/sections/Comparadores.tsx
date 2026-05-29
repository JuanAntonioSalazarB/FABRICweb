"use client";

import React from 'react';
import ErpTcoCalculatorView from '@/components/modals/ErpTcoCalculatorView';
import CloudCostCalculatorView from '@/components/modals/CloudCostCalculatorView';

export default function Comparadores() {
  return (
    <section id="comparadores" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="w-full max-w-4xl mb-12 reveal-on-scroll">
          <span className="badge-premium mb-3 inline-block">COMPARATIVE ENGINE</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light mb-4">
            ¿Cuánto dinero estás dejando ir hoy? <span className="text-accent">Descubre tu ahorro real en Oracle.</span>
          </h2>
          <p className="text-zinc-400 text-base">
            No creemos en calculadoras genéricas con números ficticios. Diseñamos herramientas para proyectar el costo total de propiedad (TCO) y ahorro de migración con datos de tu propia factura e infraestructura.
          </p>
        </div>

        {/* Herramienta 1: descripción izquierda · calculadora derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 reveal-on-scroll items-start">
          <div className="card-premium p-6 md:p-8 h-full">
            <span className="badge-premium mb-4 inline-block">Herramienta 1</span>
            <h3 className="text-3xl md:text-4xl font-serif text-accent font-light leading-tight mb-4">
              ERP TCO Comparator
            </h3>
            <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed mb-6">
              Compara los costos actuales de licencias, mantenimiento, infraestructura física y consultores de soporte de tu ERP actual (SAP S/4 HANA, ECC, EBS R12, JD Edwards, Dynamics) frente a la estructura optimizada y consolidada de Oracle Fusion Cloud.
            </p>
            <ul className="space-y-2.5 font-mono text-sm text-zinc-400">
              <li><span className="text-accent mr-2">✓</span> Proyección financiera a 3, 5 y 10 años</li>
              <li><span className="text-accent mr-2">✓</span> Evaluación de costos de base de datos oculta</li>
              <li><span className="text-accent mr-2">✓</span> Estimación de ROI y mes exacto de breakeven</li>
            </ul>
          </div>

          <div className="card-premium p-6 md:p-8 overflow-x-auto">
            <ErpTcoCalculatorView />
          </div>
        </div>

        <div className="w-full max-w-4xl my-16 ml-auto reveal-on-scroll text-right">
          <span className="badge-premium mb-3 inline-block">INFRASTRUCTURE LAYER</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light mb-4">
            ¿Tu ERP ya está en la nube y la factura sigue subiendo? <span className="text-accent">Modela el ahorro real en OCI.</span>
          </h2>
          <p className="text-zinc-400 text-base">
            Las licencias son solo una parte del gasto. Compute, almacenamiento, bases de datos gestionadas y egress pueden multiplicar tu costo operativo sin que aparezca en un solo renglón. Esta herramienta proyecta el ahorro de migrar tu capa de infraestructura con los números de tu propio entorno — no benchmarks genéricos.
          </p>
        </div>

        {/* Herramienta 2: calculadora izquierda · descripción derecha (derecha sticky al scroll, top alineado bajo navbar / cabecera simulador) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 reveal-on-scroll items-start">
          <div className="card-premium p-6 md:p-8 overflow-x-auto lg:order-1 order-2">
            <CloudCostCalculatorView />
          </div>

          {/* Wrapper sin hover-transform: evita conflictos con position:sticky en el hijo */}
          <div className="lg:order-2 order-1 lg:sticky lg:top-28 lg:z-[5] lg:self-start lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pb-0.5">
            <div className="card-premium p-6 md:p-8">
              <span className="badge-premium mb-4 inline-block">Herramienta 2</span>
              <h3 className="text-3xl md:text-4xl font-serif text-accent font-light leading-tight mb-4">
                Cloud Cost Comparator
              </h3>
              <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed mb-6">
                Si ejecutas workloads y ERPs críticos en AWS, Azure o Google Cloud, calcula cuánto ahorrarías en hosting, red y almacenamiento al migrar la infraestructura base de tus aplicaciones directamente a Oracle Cloud Infrastructure (OCI).
              </p>
              <ul className="space-y-2.5 font-mono text-sm text-zinc-400">
                <li><span className="text-accent mr-2">✓</span> Mapeo de equivalencia (Compute, S3/EBS, RDS)</li>
                <li><span className="text-accent mr-2">✓</span> Análisis de costos de transferencia de salida (Egress)</li>
                <li><span className="text-accent mr-2">✓</span> Proyección de ROI de migración de infraestructura</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
