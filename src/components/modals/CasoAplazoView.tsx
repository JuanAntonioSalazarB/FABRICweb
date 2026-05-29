"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Database, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { submitWaitlistAction } from '@/app/actions/leads';

export default function CasoAplazoView() {
  // Estados para controlar el formulario extensible
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [wlName, setWlName] = useState('');
  const [wlEmail, setWlEmail] = useState('');
  const [wlCompany, setWlCompany] = useState('');
  const [wlRole, setWlRole] = useState('');
  const [wlError, setWlError] = useState('');
  const [wlSuccess, setWlSuccess] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);

  // Email validation helper
  const isCorporateEmail = (email: string) => {
    const freeDomains = [
      'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 
      'icloud.com', 'mail.com', 'live.com', 'msn.com', 
      'yahoo.com.mx', 'live.com.mx', 'hotmail.es', 'yandex.com'
    ];
    const domain = email.toLowerCase().split('@')[1];
    return domain && !freeDomains.includes(domain);
  };

  // Waitlist submission handler
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWlError('');

    if (!isCorporateEmail(wlEmail)) {
      setWlError('Sólo se aceptan correos corporativos.');
      return;
    }

    setWlLoading(true);
    try {
      const res = await submitWaitlistAction({
        name: wlName,
        email: wlEmail,
        company: wlCompany,
        role: wlRole,
        scenario: 'migration' // Escenario predefinido para el caso de uso Fintech / Estabilización
      });

      if (res.success) {
        setWlSuccess(true);
        window.location.href = `/aplicar?wl-name=${encodeURIComponent(wlName)}&wl-company=${encodeURIComponent(wlCompany)}&wl-scenario=migration`;
      } else {
        setWlError('Error al enviar la solicitud. Intente de nuevo.');
      }
    } catch (err) {
      setWlError('Error al enviar la solicitud. Intente de nuevo.');
    } finally {
      setWlLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Diseño del Encabezado Original */}
      <div>
        <span className="badge-premium mb-2 inline-block">REAL CASE STUDY · FINTECH STABILIZATION</span>
        <h2 className="text-2xl font-serif text-white font-light">Caso Aplazo: Remediación de Cuentas por Cobrar (AR)</h2>
        <p className="text-zinc-500 text-xs mt-1">Estabilización y balanceo de subledgers con el Libro Mayor en un plazo récord de 8 semanas.</p>
      </div>

      {/* Grid de 12 Columnas Original */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-mono">
        <div className="md:col-span-8 text-zinc-400 space-y-4 font-sans text-sm leading-relaxed">
          <p>
            Aplazo, la plataforma BNPL líder en México, requería conciliar millones de cobros recurrentes mensuales sin generar inconsistencias de centavos en la contabilidad general de su ERP. Las discrepancias acumulaban descuadres que tardaban hasta 5 días hábiles en corregirse manualmente.
          </p>
          <blockquote className="border-l-2 border-accent pl-4 italic text-zinc-500 text-xs font-mono">
            &quot;Rediseñamos la capa de agregación del SLA (Subledger Accounting) Engine del ERP para agrupar transacciones en lotes coherentes directamente en la base de datos.&quot;
          </blockquote>
          <p>
            En solo 8 semanas, el equipo de FABRIC integró reglas customizadas que redujeron el ciclo de cierre contable a solo 4 horas y llevaron los descuadres a un absoluto **0.00%**, logrando erradicar el uso de hojas Excel auxiliares para las conciliaciones de IVA.
          </p>
        </div>

        <div className="md:col-span-4 space-y-4">
          {/* Caja de Métricas Original */}
          <div className="border border-accent/20 p-5 bg-accent/5 space-y-3">
            <span className="text-[10px] text-accent font-bold uppercase block">Métricas de Log:</span>
            <div className="space-y-2">
              <div>
                <span className="text-zinc-500 block text-[10px]">PLAZO DE ENTREGA:</span>
                <span className="text-white font-bold">8 Semanas Calendario</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">VOLUMEN ADMITIDO:</span>
                <span className="text-white font-bold">$4.2B MXN mensuales</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">DESCUADRES AR vs GL:</span>
                <span className="text-emerald-500 font-bold">0.00% (Balanceado)</span>
              </div>
            </div>
          </div>

          {/* Metadatos con Iconos Originales */}
          <div className="flex flex-col gap-2 text-zinc-500">
            <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-accent" /> <span>8 Semanas Totales</span></div>
            <div className="flex items-center gap-2"><Database className="w-3.5 h-3.5 text-accent" /> <span>Oracle SLA Custom</span></div>
          </div>
        </div>
      </div>

      {/* Bloque del Formulario Extensible (Ocupa todo el ancho inferior del frame) */}
      <div className="pt-4 border-t border-zinc-900 space-y-4 font-mono text-xs">
        
        {/* Botón de control de ancho completo */}
        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`w-full border p-3 flex items-center justify-between uppercase tracking-wider transition-colors ${
            isFormOpen 
              ? 'border-accent bg-accent/10 text-white' 
              : 'border-zinc-800 bg-black text-zinc-400 hover:text-white hover:border-zinc-700'
          }`}
        >
          <span className="font-bold">Aplicar para Rescate de Proyecto</span>
          {isFormOpen ? <ChevronUp className="w-4 h-4 text-accent" /> : <ChevronDown className="w-4 h-4 text-accent" />}
        </button>

        {/* Formulario que se extiende a lo largo de todo el frame */}
        {isFormOpen && (
          <div className="border border-zinc-800 bg-zinc-950 p-6 md:p-8 space-y-6">
            
            <div className="border-b border-zinc-900 pb-3">
              <span className="text-accent text-[10px] block font-bold tracking-widest uppercase mb-1">
                INGRESO A WAITLIST
              </span>
              <h3 className="text-base text-white font-serif font-light">Formulario de Admisión de Proyectos</h3>
              <p className="text-zinc-500 text-[11px] font-sans mt-0.5">Reservamos capacidad técnica únicamente para corporativos calificados.</p>
            </div>

            {wlSuccess ? (
              <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 text-center space-y-3 py-8">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm text-white font-serif font-light">Solicitud Recibida Correctamente</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto font-sans">
                  Hemos registrado tus datos. En unos momentos te redireccionaremos a la agenda corporativa.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                
                {/* Distribución limpia en 2 columnas internas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={wlName}
                      onChange={(e) => setWlName(e.target.value)}
                      placeholder="Director Ejecutivo"
                      className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-500 block mb-1">Correo Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={wlEmail}
                      onChange={(e) => setWlEmail(e.target.value)}
                      placeholder="nombre@empresa.com"
                      className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-500 block mb-1">Empresa *</label>
                    <input
                      type="text"
                      required
                      value={wlCompany}
                      onChange={(e) => setWlCompany(e.target.value)}
                      placeholder="Corporativo S.A."
                      className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-500 block mb-1">Cargo / Puesto *</label>
                    <input
                      type="text"
                      required
                      value={wlRole}
                      onChange={(e) => setWlRole(e.target.value)}
                      placeholder="CFO / Director de Sistemas"
                      className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent font-sans transition-colors"
                    />
                  </div>
                </div>

                {wlError && (
                  <div className="text-red-500 font-sans">
                    * {wlError}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={wlLoading}
                  className="w-full bg-black border border-accent text-white font-bold uppercase tracking-widest py-3 hover:bg-accent hover:text-black transition-all cursor-pointer disabled:opacity-50"
                >
                  {wlLoading ? 'Procesando...' : 'Enviar Solicitud de Admisión'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

    </div>
  );
}