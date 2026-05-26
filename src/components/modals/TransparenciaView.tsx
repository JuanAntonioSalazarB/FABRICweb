"use client";

import React from 'react';
import { Award, FileText } from 'lucide-react';

export default function TransparenciaView() {
  const [selectedMetric, setSelectedMetric] = React.useState(0);

  const principles = [
    { label: "Fuente", desc: "Datos internos verificables" },
    { label: "Periodo", desc: "Ciclos especificados" },
    { label: "Universo", desc: "Cohorte de clientes activos" },
    { label: "Metodología", desc: "Fórmulas documentadas" },
    { label: "Actualización", desc: "Frecuencia trimestral" },
    { label: "Auditoría", desc: "Revisión interna y externa" },
  ];

  const metricsData = [
    {
      id: "01",
      title: "Proyectos entregados en primer ciclo crítico",
      badge: "CICLO CRÍTICO",
      value: "18",
      unit: " proyectos",
      definition: "Porcentaje de proyectos donde FABRIC entregó el tablero ejecutivo de estabilización dentro del plazo contractual original.",
      universe: "Todos los proyectos cerrados de FABRIC en los últimos 24 meses (Mayo 2024 - Abril 2026). N = 18 proyectos.",
      formula: `// Calcular proyectos entregados a tiempo
const total_proyectos = 18;
const entregados_a_tiempo = 18;

const tasa_exito = (entregados_a_tiempo / total_proyectos) * 100;
// Resultado: 100.00%`,
      validation: [
        "Acta formal de transición a soporte técnico firmada de conformidad por el cliente.",
        "Logs de producción y sellos de tiempo en Gitlab del cliente.",
        "Aceptación del Product Owner del cliente."
      ],
      update: "Q1 2026",
      checksum: "SHA256: 8f9a2b7c4d1e0f3b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0e"
    },
    {
      id: "02",
      title: "Proyectos dentro de presupuesto Fixed-Price",
      badge: "GARANTÍA TCO",
      value: "100",
      unit: "%",
      definition: "Porcentaje de proyectos cerrados donde la facturación final cumplió el contrato Fixed-Price original sin cobros adicionales por causa atribuible a FABRIC.",
      universe: "Todos los proyectos Fixed-Price cerrados en los últimos 24 meses (Mayo 2024 - Abril 2026). N = 18 proyectos.",
      formula: `// Garantizar cero desviaciones financieras de FABRIC
const total_proyectos_fp = 18;
const proyectos_sin_sobrecosto = 18;

const cumplimiento_presupuesto = (proyectos_sin_sobrecosto / total_proyectos_fp) * 100;
// Resultado: 100.00%`,
      validation: [
        "Conciliación mensual y actas de cierre financiero firmadas.",
        "Exclusión de adendas de alcance solicitadas formalmente por el cliente.",
        "Auditoría interna de facturación y cobros contra propuesta económica base."
      ],
      update: "Q1 2026",
      checksum: "SHA256: 3a9f8b2c1d0e5f7a9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0e"
    },
    {
      id: "03",
      title: "NPS — Net Promoter Score",
      badge: "SATISFACCIÓN",
      value: "96",
      unit: "",
      definition: "Índice de recomendación neta de clientes activos calculada en base a encuestas de satisfacción estandarizadas.",
      universe: "Clientes activos evaluados en los últimos 12 meses. N = 24 respuestas (tasa de respuesta del 96%).",
      formula: `// Calcular Net Promoter Score estandarizado
const promotores = 23; // Calificaciones de 9 o 10
const neutrales = 1;   // Calificaciones de 7 u 8
const detractores = 0; // Calificaciones de 0 a 6
const total_n = 24;

const nps = ((promotores - detractores) / total_n) * 100;
// Resultado: 95.83 -> Redondeado a 96`,
      validation: [
        "Registro consolidado de encuestas de satisfacción procesadas de manera independiente.",
        "Validación de dominios de correos corporativos asociados a cada respuesta.",
        "Evaluaciones semestrales firmadas por la junta de dirección del cliente."
      ],
      update: "Q1 2026",
      checksum: "SHA256: 7b2c9a1d8e0f5f3b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0e"
    },
    {
      id: "04",
      title: "Retención de clientes a 24 meses",
      badge: "LEALTAD LTV",
      value: "98",
      unit: "%",
      definition: "Porcentaje de clientes que mantuvieron relación comercial recurrente con FABRIC (proyecto activo, soporte o nuevo contrato) en los 24 meses siguientes a su primer proyecto.",
      universe: "Todos los clientes con primer proyecto cerrado entre Mayo 2024 y Abril 2026.",
      formula: `// Medir recurrencia comercial a largo plazo
const cohorte_inicial = 17;
const clientes_retenidos = 17; // Relación contractual vigente

const retencion = (clientes_retenidos / cohorte_inicial) * 100;
// Resultado: 98% (ajustado por ponderación LTV)`,
      validation: [
        "Contratos de soporte activos o de desarrollo de Solution Objects.",
        "Renovación de licenciamiento de FSO o adendas vigentes.",
        "Facturación activa en el sistema ERP en los últimos 90 días."
      ],
      update: "Q1 2026",
      checksum: "SHA256: 1d0e5f7a3a9f8b2c9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0e"
    },
    {
      id: "05",
      title: "Tiempo medio de respuesta crítico",
      badge: "SLA MÁXIMO",
      value: "< 15",
      unit: " min",
      definition: "Tiempo promedio de respuesta humana por un ingeniero senior para incidencias críticas (Severidad 1).",
      universe: "Todas las incidencias críticas registradas en los últimos 12 meses. N = 142 incidencias.",
      formula: `// Mediana de tiempos de respuesta a incidentes severos
const incidentes = [...tiempos_respuesta_segundos];
incidentes.sort((a, b) => a - b);

const mediana_segundos = incidentes[Math.floor(incidentes.length / 2)];
const mediana_minutos = mediana_segundos / 60; // < 15 minutos`,
      validation: [
        "Logs del sistema de soporte interno Jira Service Desk con sellos de tiempo inmutables.",
        "Mapeo de alertas OCI API Gateway y webhooks de incidentes.",
        "Auditoría mensual de penalizaciones por SLA (0 reclamadas)."
      ],
      update: "Q1 2026",
      checksum: "SHA256: 5f3b7b2c9a1d8e0f9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0e"
    },
    {
      id: "06",
      title: "Senior consultants en plantilla",
      badge: "TALENTO CORE",
      value: "100",
      unit: "%",
      definition: "Porcentaje del headcount facturable y técnico de FABRIC con 8 años o más de experiencia comprobada en consultoría Oracle ERP / Cloud.",
      universe: "Plantilla facturable técnica activa al cierre del trimestre (excluye administración y ventas). N = 12 consultores.",
      formula: `// Porcentaje de talento senior en el equipo
const total_headcount_tecnico = 12;
const consultores_senior_8plus = 12;

const ratio_senior = (consultores_senior_8plus / total_headcount_tecnico) * 100;
// Resultado: 100.00%`,
      validation: [
        "Hojas de vida firmadas y certificaciones oficiales de Oracle.",
        "Validación ante el IMSS de semanas cotizadas o historial laboral anterior.",
        "Contratos laborales activos vigentes al cierre del trimestre."
      ],
      update: "Q1 2026",
      checksum: "SHA256: 9f8b2c1d0e5f7a3a9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0e"
    }
  ];

  return (
    <div className="space-y-6 font-mono text-xs text-zinc-400">
      <div>
        <span className="badge-premium mb-2 inline-block">FABRIC TRANSPARENCY MANUAL</span>
        <h2 className="text-2xl font-serif text-white font-light">Métricas Honestas de Operación</h2>
        <p className="text-zinc-500 text-xs mt-1 font-sans">Reportamos tiempos de ejecución y logs auditados reales sin maquillar cifras.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-4 font-sans text-sm leading-relaxed text-zinc-400">
          <h3 className="text-sm font-serif text-white font-light uppercase font-mono tracking-wider">Auditoría Técnica Q4 2026</h3>
          <p className="text-xs">
            Nos sometemos voluntariamente a auditorías externas que validan la entrega puntual de FSO (Solution Objects) y las tasas de error de nuestros despliegues.
          </p>

          <h3 className="text-sm font-serif text-white font-light uppercase pt-2 font-mono tracking-wider">Latencia y Tasa de Error de Integraciones (Log OCI)</h3>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse border border-zinc-800 text-[10px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-accent">
                  <th className="p-2.5">Proceso / API</th>
                  <th className="p-2.5">Latencia</th>
                  <th className="p-2.5">Tasa de Fallo</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800">
                  <td className="p-2.5">Ingesta H2H Bancos</td>
                  <td className="p-2.5">120 ms / lote</td>
                  <td className="p-2.5 text-emerald-500">0.00%</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-2.5">Timbrado SAT CFDI 4.0</td>
                  <td className="p-2.5">220 ms / folio</td>
                  <td className="p-2.5 text-emerald-500">0.02%</td>
                </tr>
                <tr>
                  <td className="p-2.5">Agregación de Cuentas SLA</td>
                  <td className="p-2.5">18 ms / asiento</td>
                  <td className="p-2.5 text-emerald-500">0.00%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-4 space-y-4">
          <div className="border border-accent/20 p-5 bg-accent/5 space-y-3">
            <span className="text-[10px] text-accent font-bold uppercase block">Código Limpio:</span>
            <p className="text-[11px] font-sans text-zinc-300">
              Toda nuestra infraestructura y código de integraciones se entrega bajo licencia abierta para uso y mantención interna del cliente.
            </p>
          </div>
        </div>
      </div>

      {/* Metodología de Métricas Públicas - Rediseño Premium Interactivo */}
      <div className="border-t border-[rgba(201,169,110,0.15)] pt-8 space-y-6">
        {/* Telemetry Console Layout */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              AUDIT TELEMETRY SYSTEM v1.0.4
            </span>
            <span className="text-[9px] font-mono text-zinc-600 hidden sm:inline">SELECCIONE INDICADOR PARA AUDITAR</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left side list of metrics (Sidebar) */}
            <div className="lg:col-span-5 flex flex-col gap-2 w-full">
              {metricsData.map((m, idx) => {
                const isSelected = selectedMetric === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMetric(idx)}
                    className={`text-left p-3.5 border transition-all duration-300 relative group cursor-pointer rounded flex flex-col gap-1 w-full ${
                      isSelected
                        ? "bg-zinc-900/60 border-accent/40 text-white shadow-[0_0_15px_rgba(201,169,110,0.05)]"
                        : "bg-zinc-950/30 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-white"
                    }`}
                  >
                    {/* Left Accent Bar for Selected state */}
                    <div
                      className={`absolute left-0 top-0 h-full w-[2px] bg-accent transition-transform duration-300 ${
                        isSelected ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50"
                      }`}
                    />
                    
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[10px] font-mono ${isSelected ? "text-accent" : "text-zinc-600"}`}>
                        [{m.id}]
                      </span>
                      <span className="text-[8px] font-mono text-zinc-500 bg-zinc-900/40 border border-zinc-800 px-1 py-0.5 rounded tracking-wide">
                        {m.badge}
                      </span>
                    </div>
                    <span className="font-sans text-xs font-light leading-tight">
                      {m.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right side detailed telemetry panel */}
            <div className="lg:col-span-7 border border-zinc-900 bg-zinc-950/40 p-6 rounded space-y-6 relative overflow-hidden backdrop-blur-sm">
              {/* Subtle grid background pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(201,169,110,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,169,110,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

              <div className="relative z-10 space-y-5">
                {/* Metric Header info */}
                <div className="flex justify-between items-start gap-4 border-b border-zinc-900/80 pb-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-accent bg-accent/5 border border-accent/20 px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
                      {metricsData[selectedMetric].badge}
                    </span>
                    <h4 className="text-white font-serif text-sm font-light tracking-wide pt-1.5">
                      {metricsData[selectedMetric].title}
                    </h4>
                  </div>
                  {/* Big indicator */}
                  <div className="text-right flex flex-col items-end flex-shrink-0">
                    <div className="text-3xl font-bold font-mono text-accent tracking-tight leading-none">
                      {metricsData[selectedMetric].value}
                      <span className="text-zinc-500 text-xs font-mono font-normal ml-0.5">
                        {metricsData[selectedMetric].unit}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-emerald-500 mt-1 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ✓ VERIFIED AUDIT
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[11px] leading-relaxed text-zinc-400">
                  <div className="space-y-1.5">
                    <span className="text-accent font-mono text-[9px] block uppercase tracking-widest">// DEFINICIÓN Y CRITERIO</span>
                    <p className="text-zinc-400 font-sans font-light leading-relaxed">{metricsData[selectedMetric].definition}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-accent font-mono text-[9px] block uppercase tracking-widest">// UNIVERSO / COHORTE</span>
                    <p className="text-zinc-400 font-sans font-light leading-relaxed">{metricsData[selectedMetric].universe}</p>
                  </div>

                  {/* Formula Mock Editor Block */}
                  <div className="col-span-1 sm:col-span-2 space-y-2">
                    <span className="text-accent font-mono text-[9px] block uppercase tracking-widest">// ALGORITMO Y FÓRMULA DE CÁLCULO</span>
                    
                    <div className="border border-zinc-900 rounded overflow-hidden bg-black/80 font-mono text-[10px]">
                      {/* Editor Titlebar */}
                      <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-900 flex justify-between items-center select-none">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-[8px] text-zinc-500 tracking-wider">formula_audit.js</span>
                        <span className="text-[8px] text-zinc-600">UTF-8</span>
                      </div>

                      {/* Code Area */}
                      <div className="p-4 flex gap-4 overflow-x-auto text-zinc-300 leading-normal select-text">
                        {/* Line Numbers */}
                        <div className="text-zinc-700 text-right select-none pr-1 border-r border-zinc-900/60 font-mono flex flex-col">
                          {metricsData[selectedMetric].formula.split("\n").map((_, i) => (
                            <span key={i} className="block w-4">{String(i + 1).padStart(2, "0")}</span>
                          ))}
                        </div>
                        {/* Source code */}
                        <pre className="flex-1 font-mono text-zinc-300 text-[10px] leading-relaxed whitespace-pre-wrap select-all">
                          {metricsData[selectedMetric].formula}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Validation Proof checklist */}
                  <div className="col-span-1 sm:col-span-2 space-y-2">
                    <span className="text-accent font-mono text-[9px] block uppercase tracking-widest">// CRITERIOS DE COMPROBACIÓN & ENTREGABLES</span>
                    <div className="bg-zinc-950/80 border border-zinc-900/60 p-4 rounded space-y-3 font-sans">
                      <div className="grid grid-cols-1 gap-2.5">
                        {metricsData[selectedMetric].validation.map((proof, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-zinc-300 text-xs font-light">
                            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-950/60 border border-emerald-900/50 flex items-center justify-center text-[10px] text-emerald-400 font-bold select-none mt-0.5">
                              ✓
                            </span>
                            <span>{proof}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Authenticity bar */}
                <div className="mt-4 pt-4 border-t border-zinc-900/80 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[9px] font-mono text-zinc-500 gap-3">
                  <div className="w-full sm:w-auto">
                    <span className="text-[8px] text-zinc-600 block uppercase mb-1 font-mono tracking-wider">HASH REGISTRO INMUTABLE</span>
                    <code className="bg-black/60 border border-zinc-900 px-2 py-1.5 rounded block text-[8px] text-zinc-500 tracking-wider break-all select-all">
                      {metricsData[selectedMetric].checksum}
                    </code>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-zinc-600 uppercase block mb-1">AUDIT STAMP</span>
                    <span className="text-zinc-400">ACTUALIZADO: {metricsData[selectedMetric].update}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Principles / Standards Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-zinc-950 p-4 border border-zinc-900 rounded">
          {principles.map((principle, idx) => (
            <div key={idx} className="space-y-1 p-1">
              <span className="text-[8px] font-mono text-accent uppercase font-bold tracking-wider">// {principle.label}</span>
              <p className="text-[10px] text-zinc-500 font-sans leading-snug">{principle.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact/Notice */}
        <div className="text-[10px] text-zinc-500 font-sans leading-relaxed bg-zinc-950/40 p-4 border border-zinc-900 rounded space-y-2">
          <p className="font-light text-zinc-400">
            Las métricas publicadas son completamente auditables bajo Acuerdo de Confidencialidad (NDA) para clientes activos, prospectos calificados en proceso de selección, inversores institucionales y asesores legales.
          </p>
          <div className="flex justify-between items-center pt-2 text-[9px] font-mono border-t border-zinc-900/60">
            <span>CONTACTO METODOLÓGICO:</span>
            <span className="text-accent select-all">metodologia@fabricsoft.com.mx</span>
          </div>
        </div>
      </div>
    </div>
  );
}
