"use client";

import React, { useState } from 'react';
import { FileText, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { submitDoctrineLeadAction } from '@/app/actions/leads';

interface Question {
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    text: "¿Qué tipo de proyecto Oracle Fusion tienes planeado?",
    options: [
      "Rescate de implementación fallida o inestable",
      "Migración de sistema legacy (EBS, JD Edwards, SAP)",
      "Implementación nueva desde cero (Greenfield)",
    ],
  },
  {
    text: "¿Quién ejecutará el proyecto?",
    options: [
      "Big Four o consultora global (Deloitte, Accenture, etc.)",
      "Partner regional (Avanttic, Inetum, etc.)",
      "Equipo interno de desarrollo",
    ],
  },
  {
    text: "¿Cuál es el presupuesto aproximado del proyecto?",
    options: [
      "Menos de $500K USD",
      "Entre $500K y $2M USD",
      "Más de $2M USD",
    ],
  },
  {
    text: "¿Cuál es tu mayor preocupación contractual?",
    options: [
      "Cobros adicionales inesperados (change orders)",
      "Retrasos en la fecha de go-live",
      "Baja adopción y reportes manuales persistentes",
    ],
  },
  {
    text: "¿Qué soporte post go-live planeas contratar?",
    options: [
      "Transición inmediata a mesa de ayuda del proveedor",
      "Acompañamiento en sitio durante el primer ciclo crítico",
      "Soporte interno sin póliza externa",
    ],
  },
  {
    text: "¿Tu borrador de contrato incluye penalizaciones por fallas en el cierre contable?",
    options: [
      "Sí, penalizaciones estándar por SLA de tickets",
      "No, se rige por horas-hombre facturables",
      "No tenemos cláusulas específicas de cierre contable",
    ],
  },
];

function getGeneratedClauses(answers: string[]) {
  const risk = answers[3] || '';

  const clausulaPresupuesto = risk.includes("change orders")
    ? `CLÁUSULA 4.3 — GARANTÍA DE PRESUPUESTO FIXED-PRICE
────────────────────────────────────────────────────
El Proveedor declara que el alcance del Anexo A es suficiente para la operación regular del ERP. Todo requerimiento no contemplado que sea mandatorio para el Go-Live será absorbido por el Proveedor sin costo adicional, salvo modificación explícita de requerimientos por parte del Cliente. Quedan prohibidas las solicitudes de incremento presupuestal por omisiones técnicas de configuración.`
    : `CLÁUSULA 4.1 — LÍMITE DE FACTURACIÓN POR FASE
────────────────────────────────────────────────────
Los servicios se facturarán bajo la modalidad fixed-price por fase entregable. Si una fase se extiende por causas imputables al equipo consultor, las semanas de retraso no generarán honorarios adicionales.`;

  const clausulaEntrega = risk.includes("Retrasos")
    ? `CLÁUSULA 7.2 — ACEPTACIÓN HASTA EL PRIMER CICLO CRÍTICO
────────────────────────────────────────────────────
El hito de Aceptación Final quedará supeditado a la ejecución exitosa del primer cierre contable mensual completo en producción. El proyecto no se considerará entregado con el simple Go-Live, sino hasta la firma del Acta de Estabilización Operativa sin tickets de severidad 1 o 2 activos.`
    : `CLÁUSULA 7.5 — GOBIERNO EN FASE DE ESTABILIZACIÓN
────────────────────────────────────────────────────
Durante el primer mes en producción, el Proveedor dispondrá de una célula de estabilización en sitio con dedicación exclusiva. Los pagos de esta fase se liberarán únicamente si el primer cierre contable se procesa íntegramente en el ERP dentro de los primeros 5 días hábiles.`;

  const clausulaAdopcion = risk.includes("adopción")
    ? `CLÁUSULA 9.1 — PENALIZACIÓN POR REPORTES MANUALES PARALELOS
────────────────────────────────────────────────────
El Proveedor garantiza que los reportes entregados cubren la totalidad de los requerimientos financieros de la fase de análisis. Si tras 30 días del Go-Live los usuarios requieren hojas de cálculo externas por deficiencias del ERP, el Proveedor automatizará dichos reportes en el sistema a su propio costo.`
    : `CLÁUSULA 9.3 — ADOPCIÓN VERIFICABLE DE USUARIOS
────────────────────────────────────────────────────
El Acta de Aceptación requiere que al menos el 90% de los usuarios clave aprueben la evaluación práctica de procesos en producción. El Proveedor impartirá las sesiones de remediación necesarias a su costo hasta alcanzar dicha métrica.`;

  return { clausulaPresupuesto, clausulaEntrega, clausulaAdopcion };
}

export default function DoctrineGenerator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = () => {
    setAnswers([]);
    setStep(1);
    setSubmitted(false);
    setErrorMsg('');
  };

  const handleOption = (option: string) => {
    const next = [...answers, option];
    setAnswers(next);
    setStep(step < 6 ? step + 1 : 7);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setEmail('');
    setName('');
    setCompany('');
    setRole('');
    setSubmitted(false);
    setErrorMsg('');
  };

  const isCorporateEmail = (email: string) => {
    const freeDomains = [
      'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 
      'icloud.com', 'mail.com', 'live.com', 'msn.com', 
      'yahoo.com.mx', 'live.com.mx', 'hotmail.es', 'yandex.com'
    ];
    const domain = email.toLowerCase().split('@')[1];
    return domain && !freeDomains.includes(domain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCorporateEmail(email)) {
      setErrorMsg('Sólo se aceptan correos corporativos.');
      return;
    }

    setLoading(true);

    try {
      const res = await submitDoctrineLeadAction({
        name,
        email,
        company,
        role,
        answers: {
          projectType: answers[0] || "",
          industry: answers[1] || "",
          revenue: answers[2] || "",
          timeline: answers[4] || "",
          concerns: [answers[3] || ""],
          roleInProject: answers[5] || ""
        }
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg('Error al registrar sus datos. Intente de nuevo.');
      }
    } catch (err) {
      setErrorMsg('Ocurrió un error al procesar el envío.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Generate clauses based on answers
  const getGeneratedClauses = () => {
    const projectType = answers[0] || '';
    const risk = answers[3] || '';
    
    let clausulaPresupuesto = { code: "", title: "", body: "" };
    let clausulaEntrega = { code: "", title: "", body: "" };
    let clausulaAdopcion = { code: "", title: "", body: "" };

    if (risk.includes("Desviación")) {
      clausulaPresupuesto = {
        code: "CLÁUSULA 4.3",
        title: "GARANTÍA DE PRESUPUESTO FIXED-PRICE (PREVENCIÓN DE CHANGE ORDERS)",
        body: "El Proveedor declara que el alcance detallado en el Anexo A es suficiente para la operación regular del ERP. Toda desviación o requerimiento no contemplado originalmente que sea mandatorio para el Go-Live, salvo modificación explícitamente por parte del Cliente, será absorbido y desarrollado por el Proveedor sin costo adicional. Quedan explícitamente prohibidas las solicitudes de incremento presupuestal (Change Orders) por omisiones técnicas de configuración."
      };
    } else {
      clausulaPresupuesto = {
        code: "CLÁUSULA 4.1",
        title: "LÍMITE DE FACTURACIÓN POR FASE",
        body: "Los servicios se facturarán bajo la modalidad de precio cerrado (Fixed-Price) por fase entregable. Si una fase se extiende más allá del cronograma planificado por causas imputables al equipo consultor del Proveedor, las semanas de retraso no generarán honorarios adicionales, manteniendo inalterado el costo total del contrato."
      };
    }

    if (risk.includes("Retrasos")) {
      clausulaEntrega = {
        code: "CLÁUSULA 7.2",
        title: "ACEPTACIÓN HASTA PRIMER CICLO CRÍTICO (NO SOLO GO-LIVE)",
        body: "El Hito de Aceptación Final y el último pago de estabilización quedarán supeditados a la ejecución exitosa del primer ciclo financiero u operativo crítico en producción (por ejemplo, el primer cierre contable mensual completo del Cliente). El proyecto no se considerará entregado con la simple puesta en marcha (Go-Live) sino hasta la firma del Acta de Estabilización Operativa sin tickets de severidad 1 o 2 activos."
      };
    } else {
      clausulaEntrega = {
        code: "CLÁUSULA 7.5",
        title: "GOBIERNO EN FASE DE ESTABILIZACIÓN",
        body: "Durante el primer mes de producción, el Proveedor dispondrá de una célula de estabilización en sitio con dedicación exclusiva. Los pagos de esta fase se liberarán únicamente si el tablero de KPI del primer cierre contable mensual se procesa en el ERP dentro de los primeros 5 días hábiles."
      };
    }

    if (risk.includes("adopción")) {
      clausulaAdopcion = {
        code: "CLÁUSULA 9.1",
        title: "PENALIZACIÓN POR REPORTES MANUALES PARALELOS",
        body: "El Proveedor garantiza que la suite de reportes nativos y personalizados entregados cubre la totalidad de los requerimientos financieros reportados en la fase de análisis. Si tras 30 días de la puesta en marcha los usuarios clave requieren ejecutar reportes contables, conciliaciones o cierres mediante hojas de cálculo externas debido a deficiencias del ERP, el Proveedor deberá automatizar dichos reportes en el sistema a su propio costo."
      };
    } else {
      clausulaAdopcion = {
        code: "CLÁUSULA 9.3",
        title: "ADOPCIÓN VERIFICABLE DE USUARIOS",
        body: "El Acta de Aceptación de Operaciones requiere que al menos el 90% de los usuarios clave (Key Users) aprueben la evaluación práctica de procesos en producción. El Proveedor impartirá las sesiones de remediación de capacitación necesarias a su costo hasta alcanzar dicha métrica."
      };
    }

    return { clausulaPresupuesto, clausulaEntrega, clausulaAdopcion };
  };

  const clauses = step === 7 ? getGeneratedClauses() : null;

  return (
    <section className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950 font-mono text-xs">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="mb-12">
          <span className="badge-premium mb-3 inline-block">DOCTRINE GENERATOR</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light mb-4">
            El vacío legal en tu contrato de Oracle que <span className="text-accent">podría costarte millones</span> si firmas hoy sin protegerte.
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl font-sans leading-relaxed">
            Responde un diagnóstico rápido sobre tu proyecto Oracle Fusion y obtén cláusulas de ingeniería crítica listas para anexar a tu contrato de servicios antes de firmar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Value proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative border border-zinc-800 bg-black/40 p-6 md:p-8 space-y-6 rounded">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/40" />

              <span className="text-[10px] text-accent font-bold uppercase block tracking-wider">── QUÉ OBTIENES ──</span>

              <div className="text-zinc-400 font-sans space-y-3 text-xs leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">→</span>
                  <span>Tres cláusulas contractuales redactadas según el perfil de riesgo específico de tu proyecto.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">→</span>
                  <span>Lenguaje técnico-legal que protege el presupuesto, el go-live y la adopción real del sistema.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">→</span>
                  <span>Un PDF descargable con disclaimer profesional de la mesa de ingeniería de FABRIC, listo para tu equipo legal.</span>
                </p>
              </div>

              <div className="border-t border-zinc-900 pt-4">
                <span className="text-zinc-500 font-bold block text-[10px] mb-3">LOS RIESGOS QUE CUBREN LAS CLÁUSULAS:</span>
                <div className="space-y-2">
                  {[
                    "Cobros adicionales por omisiones del proveedor",
                    "Go-live sin estabilización real del sistema",
                    "Adopción parcial y reportes manuales persistentes",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-500 font-sans">
                      <span className="text-accent text-[10px]">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                  <span className="text-zinc-600 block mb-1">DURACIÓN</span>
                  <span className="text-accent font-bold">3 minutos</span>
                </div>
                <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                  <span className="text-zinc-600 block mb-1">PREGUNTAS</span>
                  <span className="text-accent font-bold">6 pasos</span>
                </div>
                <div className="p-2 bg-zinc-950 border border-zinc-900 rounded">
                  <span className="text-zinc-600 block mb-1">COSTO</span>
                  <span className="text-emerald-500 font-bold">Gratuito</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive wizard */}
          <div className="lg:col-span-6 card-premium p-6 md:p-8 border border-accent bg-black flex flex-col justify-between relative rounded min-h-[420px]">

            {/* Step 0: Intro */}
            {step === 0 && (
              <div className="my-auto space-y-6 text-center py-8">
                <div className="h-16 w-16 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-accent animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-serif text-white font-light">
                    Genera tus cláusulas de protección
                  </h3>
                  <p className="text-zinc-500 font-sans text-xs max-w-sm mx-auto leading-relaxed">
                    6 preguntas sobre tu proyecto. Cláusulas contractuales personalizadas al instante.
                  </p>
                </div>
                <button
                  onClick={handleStart}
                  className="btn-primary-accent mx-auto justify-center !py-2.5 !px-6 cursor-pointer text-xs"
                >
                  Comenzar diagnóstico
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}

            {/* Steps 1–6: Questions */}
            {step >= 1 && step <= 6 && (
              <div className="space-y-6 my-auto">
                <div className="flex justify-between items-center text-[10px] text-zinc-500">
                  <span>DIAGNÓSTICO CONTRACTUAL</span>
                  <span>PASO {step} DE 6</span>
                </div>

                <div className="h-1 bg-zinc-900 w-full rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${(step / 6) * 100}%` }}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-serif text-white leading-normal font-light">
                    {questions[step - 1].text}
                  </h3>
                  <div className="space-y-2.5">
                    {questions[step - 1].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOption(option)}
                        className="w-full text-left bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-accent p-3 text-zinc-400 hover:text-white rounded transition-all flex items-center justify-between group cursor-pointer text-xs"
                      >
                        <span className="font-sans leading-snug">{option}</span>
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-accent shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="text-zinc-600 hover:text-zinc-400 text-[10px] uppercase font-bold w-fit cursor-pointer"
                >
                  [Cancelar]
                </button>
              </div>
            )}

            {/* Step 7: Results */}
            {step === 7 && clauses && (
              <div className="space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>CLÁUSULAS GENERADAS PARA TU PROYECTO</span>
                    <span className="text-emerald-500">✓ LISTO</span>
                  </div>

                  <div className="border border-zinc-800 bg-zinc-950/80 rounded-lg p-5 overflow-y-auto max-h-[260px] space-y-6 select-text leading-relaxed font-sans custom-scrollbar">
                    {/* Header */}
                    <div className="border-b border-zinc-900 pb-3 flex flex-col gap-1">
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider font-mono">
                        DOCUMENTO DE AUDITORÍA CONTRACTUAL
                      </span>
                      <h4 className="text-white font-serif text-xs font-light">
                        PROVEEDOR ORACLE · ANEXO DE CONFIGURACIÓN Y GARANTÍAS
                      </h4>
                    </div>

                    {/* Clauses list */}
                    <div className="space-y-5">
                      {[clauses.clausulaPresupuesto, clauses.clausulaEntrega, clauses.clausulaAdopcion].map((clause, idx) => (
                        <div key={idx} className="space-y-2 border-l border-accent/40 pl-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="text-[9px] font-mono font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded border border-accent/25 uppercase w-fit shrink-0">
                              {clause.code}
                            </span>
                            <span className="text-white text-[10px] font-bold tracking-tight leading-tight uppercase font-mono">
                              {clause.title}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-[11px] leading-relaxed text-justify">
                            {clause.body}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Footer disclaimer */}
                    <div className="pt-3 border-t border-zinc-900 text-[8px] text-zinc-600 font-mono text-center">
                      ESTE DOCUMENTO CONSTITUYE UN ANEXO TÉCNICO DE REFERENCIA. RECOMIENDE SU REVISIÓN CON EL DEPARTAMENTO LEGAL DE SU ORGANIZACIÓN.
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-4 space-y-4">
                  {submitted ? (
                    <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-center text-emerald-500 rounded font-sans text-xs">
                      ✓ PDF enviado. Revisa tu bandeja de entrada corporativa.
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-3"
                    >
                      <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                        Ingresa los datos de tu corporativo para recibir el PDF completo con las cláusulas y el disclaimer firmado.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nombre completo"
                          className="bg-black border border-zinc-800 text-white px-2 py-1.5 outline-none focus:border-accent text-[11px] rounded font-mono w-full"
                        />
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Empresa"
                          className="bg-black border border-zinc-800 text-white px-2 py-1.5 outline-none focus:border-accent text-[11px] rounded font-mono w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="Cargo/Puesto"
                          className="bg-black border border-zinc-800 text-white px-2 py-1.5 outline-none focus:border-accent text-[11px] rounded font-mono w-full"
                        />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="cfo@empresa.com"
                          className="bg-black border border-zinc-800 text-white px-2 py-1.5 outline-none focus:border-accent text-[11px] rounded font-mono w-full"
                        />
                      </div>

                      {errorMsg && (
                        <p className="text-red-500 text-[10px] font-sans">* {errorMsg}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary-accent w-full !py-2 text-[11px] uppercase flex items-center justify-center cursor-pointer"
                      >
                        {loading ? 'Procesando...' : 'Recibir PDF con Cláusulas'}
                      </button>
                    </form>
                  )}

                  <div className="flex justify-end items-center text-[10px] pt-1">
                    <button 
                      onClick={handleReset}
                      className="text-zinc-600 hover:text-zinc-400 cursor-pointer font-bold uppercase"
                    >
                      [Cerrar]
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}