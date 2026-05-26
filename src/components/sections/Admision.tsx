import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { submitWaitlistAction } from '@/app/actions/leads';

export default function Admision() {
  const [showForm, setShowForm] = useState(false);
  const [wlName, setWlName] = useState('');
  const [wlEmail, setWlEmail] = useState('');
  const [wlCompany, setWlCompany] = useState('');
  const [wlRole, setWlRole] = useState('');
  const [wlScenario, setWlScenario] = useState('');
  const [wlError, setWlError] = useState('');
  const [wlSuccess, setWlSuccess] = useState(false);

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

    const res = await submitWaitlistAction({
      name: wlName,
      email: wlEmail,
      company: wlCompany,
      role: wlRole,
      scenario: wlScenario
    });

    if (res.success) {
      setWlSuccess(true);
    } else {
      setWlError('Error al enviar la solicitud. Intente de nuevo.');
    }
  };

  return (
    <section id="admision" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950 font-mono">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card-premium p-6 md:p-12 reveal-on-scroll relative">
          
          {/* Corner highlights */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/40" />

          {!showForm ? (
            /* Criteria Screen */
            <div className="space-y-6 text-center">
              <span className="badge-premium mb-2 inline-block text-center">SECCIÓN 12 · APLICAR</span>
              <h2 className="text-4xl font-serif text-white font-light mb-2">APLICAR</h2>
              <p className="text-zinc-400 text-sm max-w-xl mx-auto font-sans leading-relaxed">
                Si tu organización planea una iniciativa Oracle de impacto en los próximos 12 meses, conversemos.
              </p>

              <div className="max-w-lg mx-auto border-t border-b border-[rgba(201,169,110,0.15)] py-8 my-6 text-left space-y-4">
                <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold block mb-2 font-mono">
                  Criterios de admisión:
                </span>
                <ul className="space-y-3 font-sans text-xs md:text-sm text-zinc-300">
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">✓</span>
                    <span>Facturación &gt; USD 50M anuales</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">✓</span>
                    <span>Industria: Servicios Financieros, Inmobiliario o Logística</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">✓</span>
                    <span>Iniciativa Oracle con plazo de decisión &lt; 6 meses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">✓</span>
                    <span>Patrocinio ejecutivo CFO + CTO</span>
                  </li>
                </ul>
              </div>

              {/* Live Queue Tracker */}
              <div className="max-w-lg mx-auto p-4 bg-zinc-950/60 border border-zinc-900/60 rounded text-left space-y-3 font-mono text-[10px] mb-6">
                <div className="flex items-center justify-between border-b border-zinc-900/80 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
                    <span className="text-zinc-400 font-bold uppercase tracking-wider">COLA DE ESPERA ACTIVA</span>
                  </div>
                  <span className="text-zinc-600">CAPACIDAD Q3/Q4</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Puesto #8 (Sector Financiero LATAM)</span>
                    <span className="text-accent">[NDA EN REVISIÓN]</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Puesto #7 (Logística Masiva)</span>
                    <span className="text-accent">[PRECALIFICADO]</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Puesto #6 (E-Commerce México)</span>
                    <span className="text-emerald-500">[EN SOPORTE CO-LIVE]</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                  Tiempo de respuesta: 24 horas hábiles
                </p>
                <button 
                  type="button" 
                  onClick={() => setShowForm(true)} 
                  className="btn-primary-accent justify-center w-full max-w-xs mx-auto"
                >
                  Aplicar →
                </button>
              </div>
            </div>
          ) : (
            /* Waitlist Form */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[rgba(201,169,110,0.1)] pb-4">
                <div>
                  <span className="badge-premium mb-1 inline-block">INGRESO A WAITLIST</span>
                  <h2 className="text-2xl font-serif text-white font-light">Formulario de Admisión</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-zinc-500 hover:text-white transition-colors text-[10px] uppercase border border-zinc-800 px-3 py-1 bg-black/40 hover:bg-black"
                >
                  ← Volver a Criterios
                </button>
              </div>
              <p className="text-zinc-500 text-xs font-sans leading-relaxed">
                Reservamos capacidad técnica únicamente para corporativos calificados que cumplan con los criterios de admisión.
              </p>

              {wlSuccess ? (
                <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 text-center space-y-4">
                  <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-lg text-white font-serif font-light">Solicitud Recibida Correctamente</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Hemos registrado tus datos de forma segura. Un ingeniero principal evaluará tu caso y se pondrá en contacto en menos de 24 horas hábiles.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-zinc-500 block mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={wlName}
                        onChange={(e) => setWlName(e.target.value)}
                        placeholder="Director Ejecutivo"
                        className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
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
                        className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-zinc-500 block mb-1">Empresa *</label>
                      <input
                        type="text"
                        required
                        value={wlCompany}
                        onChange={(e) => setWlCompany(e.target.value)}
                        placeholder="Corporativo S.A."
                        className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
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
                        className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-500 block mb-1">Escenario Principal *</label>
                    <select
                      required
                      value={wlScenario}
                      onChange={(e) => setWlScenario(e.target.value)}
                      className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                    >
                      <option value="" disabled>Selecciona tu situación...</option>
                      <option value="rescue">Rescate de Fusion Cloud (Prioridad 1)</option>
                      <option value="migration">Migración de ERP Legacy (Prioridad 2)</option>
                      <option value="greenfield">Implementación Greenfield (Prioridad 3)</option>
                    </select>
                  </div>

                  {wlError && (
                    <div className="text-red-500 text-xs">
                      * {wlError}
                    </div>
                  )}

                  <button type="submit" className="btn-primary-accent w-full justify-center !py-3">
                    Enviar Solicitud de Admisión
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
