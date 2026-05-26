"use client";

import React, { useState } from 'react';
import { ShieldAlert, Award, ChevronLeft } from 'lucide-react';
import { submitAssessmentAction } from '@/app/actions/leads';

const QUESTIONS = [
  "¿El cierre contable mensual toma más de 5 días hábiles?",
  "¿Tu equipo de finanzas concilia el IVA o CFDI en hojas de cálculo de Excel externas debido a limitaciones del ERP?",
  "¿Se presentan descuadres periódicos entre el auxiliar de Cuentas por Cobrar (AR) y el Libro Mayor (GL)?",
  "¿Las órdenes de compra requieren conciliación manual de tres vías (3-way match) fuera de Fusion?",
  "¿La velocidad de timbrado masivo de CFDI colapsa los flujos de cobro en periodos pico?",
  "¿Tienes tickets de soporte abiertos en My Oracle Support de severidad 1 o 2 por más de 4 semanas?",
  "¿Se realizan desarrollos a la medida (customizaciones) modificando la base estándar de Oracle Fusion?",
  "¿La ingesta de extractos bancarios diarios (Host-to-Host) requiere intervención manual frecuente?",
  "¿El ERP presenta tiempos de respuesta lentos en consultas de reportería básica?",
  "¿Los consultores externos que te dan soporte proponen parches provisionales (workarounds) en lugar de soluciones definitivas?",
  "¿Los diagramas de arquitectura de tus integraciones SOAP/REST están desactualizados o son inexistentes?",
  "¿El personal clave de IT de tu empresa no comprende el modelo de datos nativo de Oracle?"
];

export default function DiagnosticoWizardView({ onBookingLinkClick }: { onBookingLinkClick: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(12).fill(0));
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalScore = answers.reduce((a, b) => a + b, 0);
  let riskLevel = 'Bajo';
  if (totalScore > 8) {
    riskLevel = 'Alto / Remediación Crítica';
  } else if (totalScore > 3) {
    riskLevel = 'Medio / Cuello de Botella';
  }

  const handleAnswerSelect = (val: number) => {
    const updated = [...answers];
    updated[currentStep] = val;
    setAnswers(updated);
    
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(12);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCorporateEmail = (emailStr: string) => {
    const freeDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
    const domain = emailStr.toLowerCase().split('@')[1];
    return domain && !freeDomains.includes(domain);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isCorporateEmail(email)) {
      setError('Sólo se aceptan correos corporativos.');
      return;
    }

    setLoading(true);
    const res = await submitAssessmentAction({
      name,
      email,
      company,
      role,
      answers,
      score: totalScore,
      riskLevel
    });
    setLoading(false);

    if (res.success) {
      setCurrentStep(13);
    } else {
      setError('Error al procesar el diagnóstico. Intente nuevamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Steps */}
      {currentStep < 12 && (
        <div className="space-y-8">
          {/* Progress bar */}
          <div className="w-full bg-zinc-900 h-1">
            <div 
              className="bg-accent h-1 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 12) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between font-mono text-[10px] text-zinc-500">
            <span>PREGUNTA {currentStep + 1} DE 12</span>
            <span>DIAGNÓSTICO DE RIESGO FUSION</span>
          </div>

          <div className="min-h-[100px] flex items-center justify-center text-center">
            <p className="text-lg md:text-xl font-serif text-white font-light italic leading-relaxed">
              &quot;{QUESTIONS[currentStep]}&quot;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswerSelect(1)}
              className="p-4 border border-zinc-800 text-center font-mono hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer text-xs uppercase tracking-wider"
            >
              Sí / Afirmativo
            </button>
            <button
              onClick={() => handleAnswerSelect(0)}
              className="p-4 border border-zinc-800 text-center font-mono hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer text-xs uppercase tracking-wider"
            >
              No / Negativo
            </button>
          </div>

          {currentStep > 0 && (
            <button 
              onClick={handleBack} 
              className="flex items-center gap-1 font-mono text-[10px] text-zinc-500 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Pregunta Anterior
            </button>
          )}
        </div>
      )}

      {/* Step 12: Lead Capture */}
      {currentStep === 12 && (
        <div className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-xl font-serif text-white font-light">Diagnóstico compilado correctamente</h3>
            <p className="text-zinc-500 text-xs font-mono">
              Ingrese sus datos corporativos para procesar las respuestas y ver su nivel de riesgo operativo.
            </p>
          </div>

          <form onSubmit={handleLeadSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-zinc-500 block mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Director General"
                className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
              />
            </div>
            
            <div>
              <label className="text-zinc-500 block mb-1">Correo Corporativo *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@corporativo.com"
                className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-500 block mb-1">Compañía *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Corporativo Inmobiliario"
                  className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-zinc-500 block mb-1">Puesto *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="CFO / CIO"
                  className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 font-mono text-[11px]">* {error}</div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary-accent w-full justify-center !py-3"
            >
              {loading ? 'Procesando...' : 'Ver Nivel de Riesgo'}
            </button>
          </form>
        </div>
      )}

      {/* Step 13: Results Display */}
      {currentStep === 13 && (
        <div className="space-y-6 font-mono text-xs">
          <div className="text-center space-y-3 border-b border-[rgba(201,169,110,0.15)] pb-6">
            {totalScore > 8 ? (
              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
            ) : (
              <Award className="w-16 h-16 text-amber-500 mx-auto" />
            )}
            <h3 className="text-xl font-serif text-white font-light">Diagnóstico: {riskLevel}</h3>
            <p className="text-zinc-400 text-sm">
              Puntuación obtenida: <strong className="text-accent">{totalScore} / 12 puntos</strong>
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold border-b border-zinc-800 pb-2">Diagnóstico Detallado:</h4>
            {totalScore > 8 ? (
              <p className="text-zinc-400 leading-relaxed">
                Tu organización califica con un nivel de riesgo operativo <strong className="text-red-500">crítico</strong>. La presencia de descuadres en subledgers, conciliaciones masivas manuales y fallas crónicas de timbrado SAT indican que el ERP ha sido sobre-personalizado o configurado incorrectamente. Se recomienda una re-ingeniería FSO y rescate técnico inmediato.
              </p>
            ) : totalScore > 3 ? (
              <p className="text-zinc-400 leading-relaxed">
                Tu organización presenta cuellos de botella moderados. Las conciliaciones en hojas de cálculo externas y las demoras leves de cierre limitan la agilidad de los reportes trimestrales. Se recomienda corregir la base de las integraciones y optimizar consultas SQL de base de datos.
              </p>
            ) : (
              <p className="text-zinc-400 leading-relaxed">
                Tu organización mantiene controles correctos sobre el ERP. Recomendamos auditorías proactivas semestrales para asegurar la continuidad operativa y evitar desvíos en futuras actualizaciones de versión de Oracle Cloud.
              </p>
            )}
          </div>

          <div className="p-4 bg-zinc-950 border border-accent/20 space-y-3">
            <span className="text-[10px] text-zinc-500 block">RECOMENDACIÓN FABRIC:</span>
            <p className="text-white">
              Agenda una sesión de diagnóstico técnico 1-on-1 para detallar una ruta de remediación sin costo.
            </p>
            <button 
              type="button"
              onClick={onBookingLinkClick}
              className="btn-outline-accent !py-2 justify-center w-full cursor-pointer text-xs"
            >
              Ver fechas de agenda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
