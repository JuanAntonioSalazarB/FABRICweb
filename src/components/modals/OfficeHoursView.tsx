"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { bookOfficeHoursAction, getAvailableSlotsAction } from '@/app/actions/leads';

export default function OfficeHoursView() {
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadSlots() {
      try {
        const res = await getAvailableSlotsAction();
        if (res.success && res.slots) {
          setSlots(res.slots);
        } else {
          setError(res.error || 'Error al cargar los horarios disponibles.');
        }
      } catch (err) {
        console.error("Failed to load available slots:", err);
        setError('Error al conectar con el servidor.');
      } finally {
        setSlotsLoading(false);
      }
    }
    loadSlots();
  }, []);

  const uniqueDates = Array.from(new Set(slots.map(s => s.date))).sort();

  const formatSlotDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return {
      weekday: dateObj.toLocaleDateString('es-MX', { weekday: 'short' }),
      dayNum: dateObj.getDate(),
      fullLabel: dateObj.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    };
  };

  const isCorporateEmail = (emailStr: string) => {
    const freeDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
    const domain = emailStr.toLowerCase().split('@')[1];
    return domain && !freeDomains.includes(domain);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedDateStr || !selectedSlot) {
      setError('Por favor, selecciona una fecha y horario.');
      return;
    }

    if (!isCorporateEmail(email)) {
      setError('Sólo se aceptan correos corporativos.');
      return;
    }

    setLoading(true);
    const res = await bookOfficeHoursAction({
      name,
      email,
      company,
      role,
      date: selectedDateStr,
      timeSlot: selectedSlot
    });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Error al agendar la sesión. Intente nuevamente.');
    }
  };

  const availableTimes = slots
    .filter(s => s.date === selectedDateStr)
    .map(s => s.timeSlot);

  const selectedDateFormatted = selectedDateStr ? formatSlotDate(selectedDateStr) : null;

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-premium mb-2 inline-block">ENGINEERING DIRECT ACCESS</span>
        <h2 className="text-2xl font-serif text-white font-light">Office Hours de Ingeniería</h2>
        <p className="text-zinc-500 text-xs mt-1">Reserva una sesión técnica privada de 30 minutos con un Ingeniero Principal.</p>
      </div>

      {success ? (
        <div className="text-center space-y-6 max-w-xl mx-auto py-8">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-serif text-white font-light">Sesión Agendada Correctamente</h3>
          <div className="bg-zinc-950 p-6 border border-[rgba(201,169,110,0.15)] inline-block text-left text-xs font-mono space-y-2">
            <div>Fecha: <strong className="text-white">{selectedDateFormatted?.fullLabel}</strong></div>
            <div>Horario: <strong className="text-white">{selectedSlot}</strong></div>
            <div>Enlace: <strong className="text-accent">Google Meet (Enviado por correo)</strong></div>
          </div>
          <p className="text-zinc-500 text-xs max-w-sm mx-auto">
            Revisa tu bandeja de entrada corporativa para confirmar la invitación de calendario.
          </p>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Date and Time Picker */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 font-mono block">Días Disponibles:</label>
              
              {slotsLoading ? (
                <div className="text-xs font-mono text-zinc-500 animate-pulse py-4">Buscando disponibilidad en servidor...</div>
              ) : uniqueDates.length > 0 ? (
                <div className="grid grid-cols-5 gap-1 sm:gap-2 font-mono text-xs text-center">
                  {uniqueDates.map((dateStr, i) => {
                    const isSelected = selectedDateStr === dateStr;
                    const dateInfo = formatSlotDate(dateStr);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setSelectedDateStr(dateStr); setSelectedSlot(null); }}
                        className={`p-1 sm:p-2 border flex flex-col items-center justify-center transition-colors cursor-pointer ${isSelected ? 'border-accent text-accent bg-accent/5' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                      >
                        <span className="text-[8px] sm:text-[9px] text-zinc-600 block uppercase font-bold">{dateInfo.weekday}</span>
                        <span className="text-base sm:text-lg font-light text-white block mt-0.5">{dateInfo.dayNum}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs font-mono text-amber-500/80 border border-amber-900/30 bg-amber-950/5 p-4">
                  No hay fechas disponibles configuradas por el administrador en este momento.
                </div>
              )}
            </div>

            {selectedDateStr && (
              <div className="space-y-2 pt-2">
                <label className="text-xs text-zinc-500 font-mono block">Horarios CST:</label>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs text-center">
                  {availableTimes.map((slot, i) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 border transition-colors cursor-pointer ${isSelected ? 'border-accent text-accent bg-accent/5' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                      >
                        {slot.replace(' CST', '')}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: User Details Form */}
          <div className="md:col-span-5 space-y-4 font-mono text-xs">
            <div>
              <label className="text-zinc-500 block mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre"
                className="w-full bg-black border border-zinc-800 text-white p-2.5 outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-zinc-500 block mb-1">Correo Corporativo *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@corporativo.com"
                className="w-full bg-black border border-zinc-800 text-white p-2.5 outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-500 block mb-1">Empresa *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-white p-2.5 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-zinc-500 block mb-1">Cargo *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-white p-2.5 outline-none focus:border-accent"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-[10px]">* {error}</div>
            )}

            <button
              type="submit"
              disabled={loading || slotsLoading || uniqueDates.length === 0}
              className="btn-primary-accent w-full justify-center !py-2.5 mt-2"
            >
              {loading ? 'Reservando...' : 'Confirmar Agenda'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

