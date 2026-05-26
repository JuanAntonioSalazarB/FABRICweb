"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertOctagon,
  Filter,
  ChevronRight,
  X,
} from "lucide-react";

interface RejectedProject {
  id: string;
  quarter: string;
  industry: string;
  revenue: string;
  reason: string;
  category:
    | "Gobernanza"
    | "Alcance"
    | "Plazo"
    | "Capacitación"
    | "Modelo/Presupuesto";
  failedCriteria: string;
  analysis: string;
  recommendation: string;
  financialLoss?: string;
}

export default function ApplyReverse() {
  const [filterQuarter, setFilterQuarter] =
    useState<string>("ALL");

  const [filterCategory, setFilterCategory] =
    useState<string>("ALL");

  const [selectedProject, setSelectedProject] =
    useState<RejectedProject | null>(null);

  const projects: RejectedProject[] = [
    {
      id: "proj-1",
      quarter: "Q1 2026",
      industry: "Retail nacional",
      revenue: "Empresa nacional",
      reason:
        "No existía participación directa de dirección financiera.",
      category: "Gobernanza",
      failedCriteria:
        "Falta de patrocinio ejecutivo",
      analysis:
        "El proyecto dependía completamente de gerencias operativas sin participación activa de dirección financiera. En implementaciones ERP de alta criticidad, esto suele retrasar decisiones importantes y afectar la estabilidad del proyecto.",
      recommendation:
        "Definir un patrocinador ejecutivo con capacidad de decisión y participación activa durante todo el proceso.",
      financialLoss: "USD 1.2M / mes en procesos manuales y reportes paralelos",
    },

    {
      id: "proj-2",
      quarter: "Q1 2026",
      industry: "Manufactura",
      revenue: "Empresa regional",
      reason:
        "El alcance cambiaba constantemente antes de iniciar.",
      category: "Alcance",
      failedCriteria:
        "Alcance sin definición clara",
      analysis:
        "La iniciativa requería una cotización cerrada, pero los requerimientos seguían cambiando continuamente. Esto generaba un alto riesgo de retrasos, retrabajo y desviaciones de presupuesto.",
      recommendation:
        "Realizar primero una etapa de descubrimiento y definición funcional antes de iniciar el desarrollo.",
      financialLoss: "USD 850K / mes por merma en cadena de suministro y desalineación de inventarios",
    },

    {
      id: "proj-3",
      quarter: "Q2 2026",
      industry: "Fintech",
      revenue: "Holding financiera",
      reason:
        "El cronograma solicitado no era técnicamente viable.",
      category: "Plazo",
      failedCriteria:
        "Tiempo insuficiente para estabilización",
      analysis:
        "El cliente requería un go-live acelerado para un sistema crítico con múltiples integraciones y conciliaciones financieras. El tiempo disponible no permitía ejecutar pruebas completas ni estabilización adecuada.",
      recommendation:
        "Reducir el alcance inicial o extender el cronograma para asegurar una implementación estable.",
      financialLoss: "USD 2.1M / mes en reprocesamientos de conciliación manual y multas regulatorias",
    },

    {
      id: "proj-4",
      quarter: "Q2 2026",
      industry: "Centros comerciales",
      revenue: "Grupo regional",
      reason:
        "No existía compromiso interno para capacitación.",
      category: "Capacitación",
      failedCriteria:
        "Falta de adopción operativa",
      analysis:
        "La organización no planeaba asignar personal interno para transferencia de conocimiento y operación futura del sistema.",
      recommendation:
        "Definir key users internos responsables de capacitación, validación y operación posterior.",
      financialLoss: "USD 400K / mes en gastos redundantes de consultoría externa de soporte",
    },

    {
      id: "proj-5",
      quarter: "Q1 2026",
      industry: "Distribución logística",
      revenue: "Empresa mediana",
      reason:
        "El presupuesto no correspondía a la complejidad requerida.",
      category: "Modelo/Presupuesto",
      failedCriteria:
        "Presupuesto insuficiente",
      analysis:
        "El alcance requería perfiles senior especializados, pero el presupuesto contemplaba un esquema incompatible con el nivel técnico necesario.",
      recommendation:
        "Ajustar el presupuesto o replantear el alcance inicial del proyecto.",
      financialLoss: "USD 600K / mes debido a retrasos en facturación y conciliaciones bancarias",
    },

    {
      id: "proj-6",
      quarter: "Q2 2026",
      industry: "Aseguradora regional",
      revenue: "Grupo financiero",
      reason:
        "El modelo solicitado estaba enfocado únicamente en horas hombre.",
      category: "Modelo/Presupuesto",
      failedCriteria:
        "Modelo operativo no alineado",
      analysis:
        "El cliente buscaba ampliar capacidad operativa sin definir objetivos de negocio, entregables medibles ni responsabilidad sobre resultados.",
      recommendation:
        "Definir entregables claros, objetivos operativos y métricas de éxito antes de iniciar la implementación.",
      financialLoss: "USD 1.5M / mes en reportes paralelos y costos de retrabajo técnico",
    },
  ];

  const filteredProjects = projects.filter((p) => {
    const matchQ =
      filterQuarter === "ALL" ||
      p.quarter === filterQuarter;

    const matchC =
      filterCategory === "ALL" ||
      p.category === filterCategory;

    return matchQ && matchC;
  });

  const categories = [
    "ALL",
    "Gobernanza",
    "Alcance",
    "Plazo",
    "Capacitación",
    "Modelo/Presupuesto",
  ];

  const quarters = ["ALL", "Q1 2026", "Q2 2026"];

  return (
    <section
      id="apply-reverse"
      className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950 font-mono text-xs"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12 reveal-on-scroll">
          <span className="badge-premium mb-3 inline-block">
            EVALUACIÓN DE PROYECTOS
          </span>

          <h2 className="text-3xl md:text-5xl font-serif text-white font-light mb-4">
            <span className="text-accent">Por qué podríamos rechazar tu proyecto hoy</span> (y qué necesitas para asegurar ingeniería de nivel crítico).
          </h2>

          <p className="text-zinc-400 text-sm max-w-2xl font-sans leading-relaxed">
            No aceptamos todos los proyectos. Para
            garantizar implementaciones exitosas,
            trabajamos únicamente con empresas que
            cuentan con el nivel de compromiso,
            estructura y alcance necesarios para
            ejecutar sistemas críticos correctamente.
          </p>
        </div>

        {/* Outer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start reveal-on-scroll">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="relative border border-zinc-800 bg-black/40 p-6 md:p-8 space-y-6 rounded">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />

              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/40" />

              <div className="space-y-4">
                <span className="text-[10px] text-accent font-bold uppercase block tracking-wider">
                  ── CRITERIOS DE EVALUACIÓN ──
                </span>

                <div className="space-y-3 font-sans text-xs text-zinc-400 leading-relaxed">
                  <p>
                    Antes de iniciar cualquier
                    implementación evaluamos factores
                    clave que impactan directamente en
                    la estabilidad, adopción y
                    continuidad operativa del proyecto.
                  </p>

                  <p>
                    Esto incluye participación activa
                    de dirección, alcance técnicamente
                    definido, tiempos realistas de
                    ejecución, disponibilidad del
                    equipo interno y presupuesto
                    alineado a la complejidad
                    requerida.
                  </p>

                  <p>
                    Cuando alguno de estos puntos no
                    está presente, preferimos no
                    avanzar antes que comprometer la
                    calidad o estabilidad de la
                    implementación.
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-900 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                    <span className="text-zinc-600 block mb-1">
                      ENFOQUE
                    </span>

                    <span className="text-white font-bold">
                      ESTABILIDAD
                    </span>
                  </div>

                  <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                    <span className="text-zinc-600 block mb-1">
                      PRIORIDAD
                    </span>

                    <span className="text-accent font-bold">
                      CALIDAD
                    </span>
                  </div>

                  <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                    <span className="text-zinc-600 block mb-1">
                      OBJETIVO
                    </span>

                    <span className="text-emerald-500 font-bold">
                      ADOPCIÓN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-red-950/20 bg-red-950/5 p-4 rounded text-zinc-500 leading-relaxed font-sans text-xs">
              <div className="flex gap-2 items-start text-red-400 font-mono text-[10px] uppercase font-bold mb-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Información anonimizada</span>
              </div>

              <p>
                Todos los ejemplos mostrados fueron
                anonimizados para proteger la
                información y privacidad de cada
                empresa.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card-premium p-6 md:p-8 bg-black border border-zinc-800 rounded relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-6">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">
                    CASOS EVALUADOS
                  </span>

                  <h3 className="text-lg font-serif text-white font-light">
                    Proyectos no iniciados
                  </h3>
                </div>

                {/* Stats */}
                <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded flex items-center gap-4 text-[10px]">
                  <div>
                    <span className="text-zinc-500 block">
                      EVALUADOS
                    </span>

                    <span className="text-white font-bold">
                      23 proyectos
                    </span>
                  </div>

                  <div className="w-[1px] h-6 bg-zinc-900" />

                  <div>
                    <span className="text-zinc-500 block">
                      NO INICIADOS
                    </span>

                    <span className="text-accent font-bold">
                      6 proyectos
                    </span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded mb-6 space-y-3">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
                  <Filter className="w-3.5 h-3.5" />
                  <span>FILTRAR RESULTADOS:</span>
                </div>

                <div className="flex flex-wrap gap-4 text-[10px]">
                  {/* Quarter */}
                  <div className="space-y-1">
                    <span className="text-zinc-600 block">
                      PERIODO:
                    </span>

                    <div className="flex gap-1">
                      {quarters.map((q) => (
                        <button
                          key={q}
                          onClick={() =>
                            setFilterQuarter(q)
                          }
                          className={`px-2 py-1 border transition-colors cursor-pointer rounded ${
                            filterQuarter === q
                              ? "border-accent bg-accent/10 text-white font-bold"
                              : "border-zinc-800 hover:border-zinc-700 text-zinc-400"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <span className="text-zinc-600 block">
                      CATEGORÍA:
                    </span>

                    <div className="flex flex-wrap gap-1">
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() =>
                            setFilterCategory(c)
                          }
                          className={`px-2 py-1 border transition-colors cursor-pointer rounded ${
                            filterCategory === c
                              ? "border-accent bg-accent/10 text-white font-bold"
                              : "border-zinc-800 hover:border-zinc-700 text-zinc-400"
                          }`}
                        >
                          {c.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-3">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() =>
                        setSelectedProject(proj)
                      }
                      className="group border border-zinc-900 hover:border-red-900/50 bg-zinc-950/40 hover:bg-zinc-950/90 p-4 rounded transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer relative overflow-hidden"
                    >
                      {/* Left border highlight on hover */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-950/0 group-hover:bg-red-500 transition-all" />

                      <div className="space-y-2 pr-4 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded">
                            {proj.quarter}
                          </span>

                          <span className="text-white font-bold">
                            {proj.industry}
                          </span>

                          <span className="text-zinc-500 text-[10px] font-sans">
                            ({proj.revenue})
                          </span>
                        </div>

                        <p className="text-zinc-400 font-sans text-xs leading-normal">
                          <strong className="text-zinc-500 font-mono text-[10px] uppercase mr-1">
                            Resultado:
                          </strong>
                          {proj.reason}
                        </p>
                        
                        {proj.financialLoss && (
                          <div className="font-mono text-[9px] text-red-400/90 flex items-center gap-1">
                            <span className="text-red-500">⚠</span>
                            <span>PÉRDIDAS ESTIMADAS: {proj.financialLoss}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
                        <span className="text-[9px] border border-red-500/30 bg-red-950/20 text-red-400 px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wider animate-pulse">
                          [ {proj.category} ]
                        </span>

                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-red-500 transition-colors" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-zinc-900 text-zinc-600 rounded font-sans">
                    No se encontraron resultados con
                    los filtros seleccionados.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[2500] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-red-950/70 p-6 md:p-8 max-w-2xl w-full relative space-y-6 shadow-[0_0_35px_rgba(239,68,68,0.1)]">
            <button
              onClick={() =>
                setSelectedProject(null)
              }
              className="absolute top-4 right-4 text-zinc-500 hover:text-red-500 cursor-pointer font-mono text-[10px] border border-zinc-800 hover:border-red-950 px-2.5 py-1 bg-black transition-colors"
            >
              [CERRAR X]
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <AlertOctagon className="w-5 h-5 text-red-500 shrink-0" />

                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                    RESULTADO DE EVALUACIÓN
                  </span>

                  <h4 className="text-base text-white font-bold leading-none mt-1">
                    {selectedProject.industry}

                    <span className="font-sans text-xs text-zinc-500 font-normal">
                      {" "}
                      ({selectedProject.revenue})
                    </span>
                  </h4>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 text-[10px] font-mono bg-black p-3 border border-zinc-900 rounded">
                <div>
                  <span className="text-zinc-600 block">
                    PERIODO:
                  </span>

                  <span className="text-zinc-300 font-bold">
                    {selectedProject.quarter}
                  </span>
                </div>

                <div>
                  <span className="text-zinc-600 block">
                    ESTADO EVALUACIÓN:
                  </span>

                  <span className="text-red-500 font-bold uppercase">
                    [ RECHAZADO POR {selectedProject.category.toUpperCase()} ]
                  </span>
                </div>

                {selectedProject.financialLoss && (
                  <div className="col-span-2 pt-2 border-t border-zinc-900 text-red-400">
                    <span className="text-zinc-600 block">
                      IMPACTO ESTIMADO POR FRACASO:
                    </span>
                    <span className="font-bold">
                      {selectedProject.financialLoss}
                    </span>
                  </div>
                )}

                <div className="col-span-2 pt-2 border-t border-zinc-900">
                  <span className="text-zinc-600 block">
                    PUNTO CRÍTICO:
                  </span>

                  <span className="text-accent font-bold font-sans text-xs">
                    {selectedProject.failedCriteria}
                  </span>
                </div>
              </div>

              {/* Analysis */}
              <div className="space-y-2">
                <span className="text-zinc-500 text-[10px] font-bold block">
                  POR QUÉ NO AVANZÓ EL PROYECTO:
                </span>

                <p className="text-zinc-400 font-sans text-xs leading-relaxed bg-zinc-950 border border-zinc-900 p-4 rounded text-justify">
                  {selectedProject.analysis}
                </p>
              </div>

              {/* Recommendation */}
              <div className="space-y-2">
                <span className="text-accent text-[10px] font-bold block">
                  QUÉ TENDRÍA QUE CAMBIAR:
                </span>

                <div className="border border-accent/20 bg-accent/5 p-4 rounded text-zinc-300 font-sans text-xs leading-relaxed">
                  {selectedProject.recommendation}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}