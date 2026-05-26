"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PHRASES = [
  "acompañar el primer cierre real",
  "soporte post go-live garantizado",
  "usuarios operando sin fricción",
  "cero incidencias sin resolver",
  "responsabilidad hasta producción",
  "entrega que significa algo real",
  "el cierre contable como criterio",
];

const STATS = [
  {
    tag: "RISK METRIC FSO-01",
    value: "73%",
    label: "de go-lives abandonan al cliente",
    title: "La brecha post go-live",
    desc: "7 de cada 10 proyectos Oracle Fusion terminan técnicamente en el go-live, pero operativamente el cliente queda solo frente al primer cierre contable real. Los equipos de implementación se retiran, los tickets quedan abiertos y los usuarios enfrentan el sistema sin soporte.",
    insight:
      "Nuestro contrato no se cierra en el go-live. El hito de entrega es el primer ciclo contable completo operado en producción, con nuestro equipo presente.",
  },
  {
    tag: "OPERATING STANDARD FSO-02",
    value: "1er ciclo",
    label: "nuestra definición real de entrega",
    title: "El estándar que redefinimos",
    desc: "El primer cierre contable es el momento de la verdad en cualquier implementación ERP. Es cuando los usuarios reales, con datos reales, ejecutan procesos reales por primera vez. Todo lo anterior —UAT, cargas, formación— es preparación. El ciclo es la entrega.",
    insight:
      "Definimos contractualmente que la implementación está completa cuando el primer período contable cierra sin intervención de nuestro equipo. Hasta entonces, seguimos presentes.",
  },
  {
    tag: "CONTRACTUAL ENFORCEMENT FSO-03",
    value: "100% contractual",
    label: "no es promesa comercial",
    title: "Compromisos que se firman",
    desc: "La diferencia entre una promesa comercial y un compromiso contractual es la rendición de cuentas. Cualquier consultora puede prometer soporte post go-live; nosotros lo escribimos en el contrato con criterios medibles y consecuencias definidas.",
    insight:
      "No es un slide de ventas. Es una cláusula. Si no cumplimos la permanencia hasta el primer cierre operativo, existen mecanismos contractuales que lo respaldan.",
  },
];

// ─── Typewriter hook ────────────────────────────────────────────────────────

function useTypewriter(phrases: string[]) {
  const [displayed, setDisplayed] = useState("");
  const state = useRef({ pi: 0, ci: 0, deleting: false, paused: false });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      const { pi, ci, deleting, paused } = state.current;
      const phrase = phrases[pi];

      if (paused) return;

      if (!deleting) {
        const next = ci + 1;
        state.current.ci = next;
        setDisplayed(phrase.slice(0, next));
        if (next === phrase.length) {
          state.current.paused = true;
          timeout = setTimeout(() => {
            state.current.paused = false;
            state.current.deleting = true;
            tick();
          }, 2200);
          return;
        }
        timeout = setTimeout(tick, 68);
      } else {
        const next = ci - 1;
        state.current.ci = next;
        setDisplayed(phrase.slice(0, next));
        if (next === 0) {
          state.current.deleting = false;
          state.current.pi = (pi + 1) % phrases.length;
        }
        timeout = setTimeout(tick, 38);
      }
    }

    tick();
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return displayed;
}

// ─── Modal ──────────────────────────────────────────────────────────────────

type StatItem = (typeof STATS)[number];

function Modal({
  stat,
  onClose,
}: {
  stat: StatItem | null;
  onClose: () => void;
}) {
  const open = stat !== null;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Only mount portal on the client to avoid SSR hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={stat?.title}
    >
      <div
        className={`relative w-full max-w-lg bg-zinc-950 border border-[rgba(201,169,110,0.35)] rounded-xl p-8 transition-all duration-300 ${
          open ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        }`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-[rgba(201,169,110,0.2)] rounded-md text-accent hover:border-accent hover:bg-[rgba(201,169,110,0.06)] transition-all"
          aria-label="Cerrar"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {stat && (
          <>
            <span className="inline-block font-mono text-[9px] tracking-widest font-bold text-accent border border-[rgba(201,169,110,0.3)] px-2 py-1 rounded mb-4">
              {stat.tag}
            </span>

            <div className="text-5xl font-serif font-light text-accent mb-3">
              {stat.value}
            </div>

            <h3 className="text-xl font-serif font-light text-white mb-4">
              {stat.title}
            </h3>

            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              {stat.desc}
            </p>

            <div className="h-px bg-[rgba(201,169,110,0.15)] mb-5" />

            <p className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase mb-2">
              IMPLICACIÓN OPERATIVA
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">{stat.insight}</p>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function PuenteSection() {
  const typed = useTypewriter(PHRASES);
  const [activeStat, setActiveStat] = useState<StatItem | null>(null);

  return (
    <section
      id="puente"
      className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-black"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* ── Main card ── */}
        <div className="card-premium p-8 md:p-14 reveal-on-scroll">
          {/* Header */}
          <div className="mb-10">
            <span className="badge-premium mb-6 inline-block">
              TESIS OPERATIVA
            </span>

            <p className="text-zinc-400 text-lg md:text-2xl font-serif leading-relaxed max-w-3xl mb-8">
              La mayoría de las implementaciones Oracle Fusion celebran el
              go-live y abandonan al cliente con cierres pesados, usuarios
              confundidos e incidencias abiertas.
            </p>

            <div className="w-20 h-px bg-accent opacity-70 mb-8" />

            <h2 className="text-4xl md:text-6xl font-serif font-light text-white leading-tight max-w-4xl mb-8">
              Nosotros nos quedamos hasta el primer cierre contable operado{" "}
              <span className="text-accent italic">en producción.</span>
            </h2>

            {/* Typewriter */}
            <div
              className="flex items-center gap-2 min-h-[2rem]"
              aria-live="polite"
            >
              <span className="text-zinc-500 text-sm">Eso significa:</span>
              <span className="text-accent text-sm font-mono font-medium">
                {typed}
              </span>
              <span
                className="inline-block w-0.5 h-4 bg-accent align-text-bottom animate-[blink_0.8s_step-end_infinite]"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[rgba(201,169,110,0.15)] pt-6 flex flex-wrap items-center gap-4">
            <span className="badge-premium">DOCTRINA 01</span>
            <span className="text-white text-xl md:text-2xl font-serif font-light">
              Por contrato.
            </span>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 reveal-on-scroll">
          {STATS.map((stat) => (
            <button
              key={stat.tag}
              onClick={() => setActiveStat(stat)}
              className="text-left bg-zinc-950/60 border border-[rgba(201,169,110,0.2)] hover:border-accent p-6 relative overflow-hidden transition-all duration-300 shadow-[0_0_15px_rgba(201,169,110,0.02)] hover:shadow-[0_0_20px_rgba(201,169,110,0.06)] hover:-translate-y-0.5 rounded-lg group focus:outline-none focus:ring-2 focus:ring-accent/60"
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent/40" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-accent/40" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-accent/40" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-accent/40" />

              <div className="flex items-center justify-between mb-4 border-b border-zinc-900/60 pb-2">
                <span className="font-mono text-[9px] text-accent tracking-widest font-bold uppercase">
                  {stat.tag}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />
              </div>

              <div className="text-3xl md:text-4xl text-white font-serif font-light mb-3 group-hover:text-accent transition-colors">
                {stat.value}
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500 leading-relaxed mb-3">
                {stat.label}
              </p>

              <p className="font-mono text-[9px] tracking-widest text-accent/0 group-hover:text-accent/50 transition-colors uppercase">
                ↗ ver detalle
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal stat={activeStat} onClose={() => setActiveStat(null)} />
    </section>
  );
}