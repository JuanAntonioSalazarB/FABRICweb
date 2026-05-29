"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

type Step = {
  num: string;
  title: string;
  short: string;
  desc: string;
  items: string[];
  tags: string[];
  duration: string;
};

const steps: Step[] = [
  {
    num: "01 · DIAGNÓSTICO",
    title: "DIAGNÓSTICO",
    short: "Análisis ejecutivo de arquitectura, procesos, configuración, riesgos e integraciones.",
    desc: "Realizamos una revisión integral de tu ecosistema tecnológico, identificando vulnerabilidades, desvíos y oportunidades de remediación inmediata en arquitectura e integraciones.",
    items: [
      "Auditoría de configuraciones críticas del ERP",
      "Mapeo de integraciones y dependencias activas",
      "Análisis de riesgos transaccionales y de cumplimiento",
      "Reporte ejecutivo de hallazgos y priorización",
    ],
    tags: ["Arquitectura", "Procesos", "Seguridad"],
    duration: "Soporte de primer cierre contable",
  },
  {
    num: "02 · ARQUITECTURA",
    title: "ARQUITECTURA",
    short: "Diseño de la solución técnica con FSO Engine y roadmap 30-60-90 días.",
    desc: "Estructuramos la solución ideal utilizando nuestro FSO Engine para acelerar procesos y planificar la estabilización en entregas modulares acotadas.",
    items: [
      "Especificación técnica detallada de la solución",
      "Definición del roadmap de ejecución (30-60-90 días)",
      "Alineación de stakeholders y plan de gobernanza",
      "Modelado de datos y flujos de integración objetivo",
    ],
    tags: ["FSO Engine", "Roadmap", "Diseño Técnico"],
    duration: "Soporte y optimización continua",
  },
  {
    num: "03 · DESPLIEGUE",
    title: "DESPLIEGUE",
    short: "Implementación con Zero-Trust, control de cambios y gobierno de proyecto.",
    desc: "Despliegue y construcción de soluciones bajo estrictas directrices de seguridad cibernética, control estricto de versiones y gobierno transparente del proyecto.",
    items: [
      "Desarrollo y configuración en ambientes de Staging",
      "Protocolos de seguridad y cifrado Zero-Trust",
      "Pruebas integrales de volumen y estrés transaccional",
      "Paso certificado a producción mediante control de cambios",
    ],
    tags: ["Zero-Trust", "Gobierno", "Producción"],
    duration: "Soporte y optimización continua",
  },
  {
    num: "04 · ESTABILIZACIÓN",
    title: "ESTABILIZACIÓN",
    short: "Acompañamiento durante primer ciclo crítico hasta tablero ejecutivo de estabilización.",
    desc: "Acompañamiento continuo y monitoreo en tiempo real durante los primeros periodos críticos para asegurar cero incidencias operativas en producción.",
    items: [
      "Soporte de primer nivel durante el primer cierre contable",
      "Monitoreo automatizado de rendimiento en tiempo real",
      "Resolución inmediata de incidencias críticas",
      "Entrega de tablero ejecutivo de estabilización con KPIs",
    ],
    tags: ["Primer Cierre", "Monitoreo", "Estabilización"],
    duration: "Soporte de primer cierre contable",
  },
  {
    num: "05 · OPTIMIZACIÓN",
    title: "OPTIMIZACIÓN",
    short: "Optimización continua con agentes IA propios.",
    desc: "Mejora constante y automatización inteligente de flujos recurrentes utilizando agentes de inteligencia artificial específicos para tu ERP.",
    items: [
      "Monitoreo proactivo mediante agentes inteligentes",
      "Optimización de consultas y tiempos de respuesta",
      "Automatización de reportes ejecutivos recurrentes",
      "Auditorías de eficiencia operacional trimestrales",
    ],
    tags: ["Agentes IA", "Automatización", "Eficiencia"],
    duration: "Soporte y optimización continua",
  },
];

export default function Lifecycle() {
  const [selected, setSelected] = useState<number>(0);
  const current = steps[selected];

  return (
    <section
      id="lifecycle"
      className="pt-40 pb-28 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 reveal-on-scroll">
          <span className="badge-premium mb-3 inline-block">
            CÓMO ENTREGAMOS
          </span>

          <h2 className="text-3xl md:text-5xl font-serif font-light text-white leading-tight">
            El camino crítico para <span className="text-accent">detener el sangrado operativo</span>: De la crisis a la estabilización.
          </h2>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 reveal-on-scroll items-start">
          {/* Vertical timeline navigation (Left Column) - visible on desktop */}
          <div className="hidden lg:flex lg:col-span-5 flex-col relative">
            {steps.map((step, i) => {
              const isActive = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full flex items-center gap-6 py-5 text-left transition-all duration-300 group cursor-pointer focus:outline-none border-b border-zinc-900/60 last:border-b-0`}
                >
                  {/* Large elegant number */}
                  <span 
                    className={`font-mono text-3xl md:text-4xl font-extralight tracking-tighter transition-all duration-300 ${
                      isActive ? "text-accent scale-105" : "text-zinc-800 group-hover:text-zinc-600"
                    }`}
                  >
                    {step.num.split(" · ")[0]}
                  </span>

                  <div className="flex-1">
                    <span 
                      className={`font-serif text-base tracking-wide block transition-colors duration-300 ${
                        isActive ? "text-white font-normal" : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  <ChevronRight 
                    className={`w-4 h-4 transition-all duration-300 shrink-0 ${
                      isActive ? "text-accent translate-x-0 opacity-100" : "text-zinc-700 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    }`} 
                  />
                </button>
              );
            })}
          </div>

          {/* Horizontal scrollable tab list - visible on mobile/tablet */}
          <div className="lg:hidden w-full overflow-x-auto flex border-b border-zinc-900 pb-2 mb-6 gap-2 snap-x scrollbar-thin">
            {steps.map((step, i) => {
              const isActive = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`snap-align-start px-4 py-2 border transition-all cursor-pointer font-serif text-xs rounded whitespace-nowrap ${
                    isActive
                      ? "border-accent bg-accent/5 text-white"
                      : "border-zinc-900 bg-zinc-950 text-zinc-500 hover:border-zinc-800"
                  }`}
                >
                  {step.title}
                </button>
              );
            })}
          </div>

          {/* Active step details panel (Right/Main Column) */}
          <div className="lg:col-span-7 w-full">
            <div className="liquid-glass-gold p-6 md:p-8 relative overflow-hidden">
              {/* Corner decor lines */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/30" />
              
              {/* Animated container for smooth content switching */}
              <div key={selected} className="animate-fade-in space-y-6">
                <div>
                  <div className="mb-2">
                    <span className="badge-premium text-[9px]">
                      {current.num}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-serif text-white font-light tracking-wide mb-3">
                    {current.title}
                  </h3>

                  <p className="text-zinc-300 font-sans text-sm md:text-base leading-relaxed">
                    {current.desc}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-3 pt-4 border-t border-zinc-900">
                  <span className="text-[10px] text-accent font-bold uppercase block tracking-wider font-mono">
                    ── ACTIVIDADES Y ENTREGABLES ──
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {current.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 bg-zinc-950/40 border border-zinc-900 p-3.5 rounded-lg transition-all duration-300 hover:border-zinc-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <p className="text-zinc-400 font-sans text-xs md:text-sm leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags and Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-900">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {current.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-zinc-900/40 text-zinc-400 border border-zinc-900 text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Navigation controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected((prev) => (prev > 0 ? prev - 1 : prev))}
                      disabled={selected === 0}
                      className="px-3 py-1.5 border border-zinc-800 rounded bg-zinc-950 text-zinc-500 hover:text-accent hover:border-accent/40 disabled:opacity-30 disabled:hover:text-zinc-500 disabled:hover:border-zinc-800 transition-all text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Anterior
                    </button>

                    <button
                      onClick={() => setSelected((prev) => (prev < steps.length - 1 ? prev + 1 : prev))}
                      disabled={selected === steps.length - 1}
                      className="px-3 py-1.5 border border-accent bg-accent text-black font-semibold rounded hover:bg-accent-hover transition-all text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      Siguiente
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}