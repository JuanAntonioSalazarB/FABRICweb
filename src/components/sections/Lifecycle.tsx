import React, { useState } from "react";

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
    num: "01 · DIAGNOSE",
    title: "DIAGNOSE",
    short: "Análisis ejecutivo de arquitectura, procesos, configuración, riesgos e integraciones.",
    desc: "Realizamos una revisión integral de tu ecosistema tecnológico, identificando vulnerabilidades, desvíos y oportunidades de remediación inmediata en arquitectura e integraciones.",
    items: [
      "Auditoría de configuraciones críticas del ERP",
      "Mapeo de integraciones y dependencias activas",
      "Análisis de riesgos transaccionales y de cumplimiento",
      "Reporte ejecutivo de hallazgos y priorización",
    ],
    tags: ["Arquitectura", "Procesos", "Seguridad"],
    duration: "Duración estimada: 1–2 semanas",
  },
  {
    num: "02 · ARCHITECT",
    title: "ARCHITECT",
    short: "Diseño de la solución técnica con FSO Engine y roadmap 30-60-90 días.",
    desc: "Estructuramos la solución ideal utilizando nuestro FSO Engine para acelerar procesos y planificar la estabilización en entregas modulares acotadas.",
    items: [
      "Especificación técnica detallada de la solución",
      "Definición del roadmap de ejecución (30-60-90 días)",
      "Alineación de stakeholders y plan de gobernanza",
      "Modelado de datos y flujos de integración objetivo",
    ],
    tags: ["FSO Engine", "Roadmap", "Diseño Técnico"],
    duration: "Duración estimada: 2 semanas",
  },
  {
    num: "03 · DEPLOY",
    title: "DEPLOY",
    short: "Implementación con Zero-Trust, control de cambios y gobierno de proyecto.",
    desc: "Despliegue y construcción de soluciones bajo estrictas directrices de seguridad cibernética, control estricto de versiones y gobierno transparente del proyecto.",
    items: [
      "Desarrollo y configuración en ambientes de Staging",
      "Protocolos de seguridad y cifrado Zero-Trust",
      "Pruebas integrales de volumen y estrés transaccional",
      "Paso certificado a producción mediante control de cambios",
    ],
    tags: ["Zero-Trust", "Gobierno", "Producción"],
    duration: "Duración estimada: 4-8 semanas",
  },
  {
    num: "04 · STABILIZE",
    title: "STABILIZE",
    short: "Acompañamiento durante primer ciclo crítico hasta tablero ejecutivo de estabilización.",
    desc: "Acompañamiento continuo y monitoreo en tiempo real durante los primeros periodos críticos para asegurar cero incidencias operativas en producción.",
    items: [
      "Soporte de primer nivel durante el primer cierre contable",
      "Monitoreo automatizado de rendimiento en tiempo real",
      "Resolución inmediata de incidencias críticas",
      "Entrega de tablero ejecutivo de estabilización con KPIs",
    ],
    tags: ["Primer Cierre", "Monitoreo", "Estabilización"],
    duration: "Ciclo: Primer ciclo crítico contable",
  },
  {
    num: "05 · OPTIMIZE",
    title: "OPTIMIZE",
    short: "Optimización continua con agentes IA propios.",
    desc: "Mejora constante y automatización inteligente de flujos recurrentes utilizando agentes de inteligencia artificial específicos para tu ERP.",
    items: [
      "Monitoreo proactivo mediante agentes inteligentes",
      "Optimización de consultas y tiempos de respuesta",
      "Automatización de reportes ejecutivos recurrentes",
      "Auditorías de eficiencia operacional trimestrales",
    ],
    tags: ["Agentes IA", "Automatización", "Eficiencia"],
    duration: "Ciclo: Continuo de optimización",
  },
];

export default function Lifecycle() {
  const [selected, setSelected] = useState<number | null>(null);

  const current = selected !== null ? steps[selected] : null;

  return (
    <section
      id="lifecycle"
      className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12 reveal-on-scroll">
          <span className="badge-premium mb-3 inline-block">
            CÓMO ENTREGAMOS
          </span>

          <h2 className="text-3xl md:text-5xl font-serif font-light text-white mb-4">
            El camino crítico para <span className="text-accent">detener el sangrado operativo</span>: De la crisis a la estabilización.
          </h2>

          <p className="text-zinc-400 text-base leading-relaxed">
            De diagnóstico a primer ciclo crítico.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 reveal-on-scroll">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="card-premium p-5 text-left transition-all duration-300 hover:border-[rgba(201,169,110,0.35)] hover:bg-[rgba(201,169,110,0.03)]"
            >
              <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent block mb-4">
                {step.num}
              </span>

              <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                {step.short}
              </p>

              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-zinc-500 font-mono">
                <span>Ver detalles</span>

                <span className="text-accent">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected !== null && current && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card-premium w-full max-w-2xl p-6 md:p-8 relative"
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 text-zinc-500 hover:text-accent transition-colors text-sm"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="badge-premium mb-4 inline-block">
                {current.num}
              </span>

              <h3 className="text-2xl md:text-3xl font-serif font-light text-white mb-4">
                {current.title}
              </h3>

              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                {current.desc}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-8">
              {current.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 border-b border-zinc-800 pb-3"
                >
                  <span className="text-accent shrink-0">—</span>

                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {current.tags.map((tag, i) => (
                <span
                  key={i}
                  className="badge-premium text-[10px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-[rgba(201,169,110,0.15)] pt-5">
              <span className="text-zinc-500 text-xs font-mono">
                {current.duration}
              </span>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setSelected((s) =>
                      s !== null && s > 0 ? s - 1 : s
                    )
                  }
                  disabled={selected === 0}
                  className="btn-outline-accent disabled:opacity-30"
                >
                  ← Anterior
                </button>

                <button
                  onClick={() =>
                    setSelected((s) =>
                      s !== null && s < steps.length - 1 ? s + 1 : s
                    )
                  }
                  disabled={selected === steps.length - 1}
                  className="btn-primary-accent disabled:opacity-30"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}