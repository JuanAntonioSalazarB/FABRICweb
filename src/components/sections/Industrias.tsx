"use client";

import { useState } from "react";
import { Landmark, Building2, Truck } from "lucide-react";

const INDUSTRIAS = [
  {
    id: "financiero",
    icon: Landmark,
    tag: "VERTICAL FSO-01",
    title: "Servicios Financieros",
    subtitle: "Bancos · Fintech · Crédito",
    summary:
      "Compliance, continuidad operativa y cierre contable regulatorio. Donde un error contable no es un ticket: es un expediente regulatorio.",
    detail: [
      {
        label: "Caso de uso crítico",
        text: "Conciliación automática de cuentas T+1 en entornos multi-divisa con reporting regulatorio CNBV/IFRS integrado.",
      },
      {
        label: "Riesgo sin ERP estable",
        text: "Retrasos en el cierre contable equivalen a sanciones, auditorías forzadas y exposición reputacional ante reguladores.",
      },
      {
        label: "Lo que garantizamos",
        text: "Primer cierre regulatorio operado en producción con nuestro equipo presente. Sin excepciones.",
      },
    ],
  },
  {
    id: "inmobiliario",
    icon: Building2,
    tag: "VERTICAL FSO-02",
    title: "Inmobiliario y Retail",
    subtitle: "Multi-plaza · Multi-entidad · Centros Comerciales",
    summary:
      "Revenue management, gestión de espacios y conciliación de rentas variables. Operaciones donde cada entidad es un mundo contable distinto.",
    detail: [
      {
        label: "Caso de uso crítico",
        text: "Consolidación financiera en tiempo real de 40+ entidades jurídicas con rentas variables indexadas a ventas de arrendatarios.",
      },
      {
        label: "Riesgo sin ERP estable",
        text: "Errores en la imputación de rentas generan litigios con arrendatarios y descuadres que se arrastran trimestre a trimestre.",
      },
      {
        label: "Lo que garantizamos",
        text: "Modelo de datos multi-entidad auditado y primer ciclo de facturación de rentas ejecutado sin intervención manual.",
      },
    ],
  },
  {
    id: "logistica",
    icon: Truck,
    tag: "VERTICAL FSO-03",
    title: "Logística y Distribución",
    subtitle: "Multi-CD · Multi-país · Multi-modal",
    summary:
      "Supply chain, trazabilidad fiscal y conciliación de transportes. Operaciones donde el ERP dicta el ritmo de la cadena entera.",
    detail: [
      {
        label: "Caso de uso crítico",
        text: "Trazabilidad fiscal end-to-end en operaciones cross-border con CFDI 4.0, carta porte y matching automático de guías vs. facturas.",
      },
      {
        label: "Riesgo sin ERP estable",
        text: "Una ruptura en el flujo de comprobantes fiscales detiene embarques, genera retenciones aduaneras y expone a multas SAT.",
      },
      {
        label: "Lo que garantizamos",
        text: "Primer cierre de inventario y conciliación fiscal operados en producción antes de dar por terminada la implementación.",
      },
    ],
  },
];

export default function Industrias() {
  const [active, setActive] = useState<string | null>(null);

  const activeData = INDUSTRIAS.find((i) => i.id === active) ?? null;

  return (
    <section
      id="industrias"
      className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 reveal-on-scroll">
          <span className="badge-premium mb-5 inline-block">
            INDUSTRIAS FOCALES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light leading-tight mb-5">
            Tres verticales donde el ERP{" "}
            <span className="text-accent italic">no puede fallar.</span>
          </h2>
          <p className="text-zinc-500 text-base font-serif leading-relaxed max-w-xl">
            No somos generalistas. Operamos exclusivamente en industrias donde
            el sistema contable es columna vertebral de la operación crítica y
            un go-live fallido tiene consecuencias regulatorias, contractuales o
            fiscales medibles.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal-on-scroll">
          {INDUSTRIAS.map((ind) => {
            const Icon = ind.icon;
            const isActive = active === ind.id;

            return (
              <button
                key={ind.id}
                onClick={() => setActive(isActive ? null : ind.id)}
                className={`text-left p-7 border rounded-lg relative overflow-hidden transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-accent/60
                  ${
                    isActive
                      ? "border-accent bg-[rgba(201,169,110,0.04)] shadow-[0_0_30px_rgba(201,169,110,0.07)]"
                      : "border-zinc-800 hover:border-[rgba(201,169,110,0.4)] hover:shadow-[0_0_20px_rgba(201,169,110,0.04)] hover:-translate-y-0.5"
                  }`}
              >
                {/* Corner brackets */}
                <div
                  className={`absolute top-0 left-0 w-3 h-3 border-t border-l transition-colors duration-300 ${isActive ? "border-accent" : "border-accent/30 group-hover:border-accent/60"}`}
                />
                <div
                  className={`absolute top-0 right-0 w-3 h-3 border-t border-r transition-colors duration-300 ${isActive ? "border-accent" : "border-accent/30 group-hover:border-accent/60"}`}
                />
                <div
                  className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l transition-colors duration-300 ${isActive ? "border-accent" : "border-accent/30 group-hover:border-accent/60"}`}
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r transition-colors duration-300 ${isActive ? "border-accent" : "border-accent/30 group-hover:border-accent/60"}`}
                />

                {/* Tag row */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[9px] tracking-widest text-accent/70 font-bold">
                    {ind.tag}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isActive ? "bg-accent" : "bg-accent/30 group-hover:bg-accent/60"}`}
                  />
                </div>

                {/* Icon */}
                <div
                  className={`mb-5 transition-colors duration-300 ${isActive ? "text-accent" : "text-accent/60 group-hover:text-accent"}`}
                >
                  <Icon className="w-7 h-7" strokeWidth={1.25} />
                </div>

                {/* Title */}
                <h3
                  className={`text-lg font-serif font-light mb-1 transition-colors duration-300 ${isActive ? "text-accent" : "text-white group-hover:text-white"}`}
                >
                  {ind.title}
                </h3>
                <p className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase mb-4">
                  {ind.subtitle}
                </p>

                {/* Summary */}
                <p className="text-zinc-500 text-xs leading-relaxed mb-5">
                  {ind.summary}
                </p>

                {/* CTA hint */}
                <p
                  className={`font-mono text-[9px] tracking-widest uppercase transition-colors duration-300 ${isActive ? "text-accent/70" : "text-accent/0 group-hover:text-accent/40"}`}
                >
                  {isActive ? "↑ cerrar detalle" : "↗ ver detalle"}
                </p>
              </button>
            );
          })}
        </div>

        {/* Expanded detail panel */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            activeData
              ? "max-h-[600px] opacity-100 mt-4"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          {activeData && (
            <div className="border border-accent/20 rounded-lg bg-black/40 p-8 md:p-10">
              {/* Panel header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8 pb-6 border-b border-[rgba(201,169,110,0.12)]">
                <div>
                  <span className="font-mono text-[9px] tracking-widest text-accent/60 font-bold block mb-2">
                    {activeData.tag} · ANÁLISIS OPERATIVO
                  </span>
                  <h4 className="text-2xl md:text-3xl font-serif font-light text-white">
                    {activeData.title}
                  </h4>
                </div>
                <activeData.icon
                  className="w-8 h-8 text-accent/40 mt-1"
                  strokeWidth={1}
                />
              </div>

              {/* Detail items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeData.detail.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <p className="font-mono text-[9px] tracking-widest text-accent/50 uppercase font-bold">
                      {item.label}
                    </p>
                    <div className="w-8 h-px bg-accent/30" />
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}