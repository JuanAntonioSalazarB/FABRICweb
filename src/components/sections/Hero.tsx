import React from 'react';
import { ArrowRight, Clock, Activity, Award } from 'lucide-react';

interface HeroProps {
  setActiveOverlayModal?: (modal: 'diagnostico' | 'office-hours' | 'ape-plazas' | 'aplazo' | 'doctrina' | 'transparencia' | null) => void;
}

export default function Hero({ setActiveOverlayModal }: HeroProps) {
  return (
    <header id="inicio" className="relative overflow-hidden pt-28 md:pt-36 pb-20 border-b border-[rgba(201,169,110,0.15)] bg-black">
      {/* HUD Architectural Glows (No Grids, Multi-point) */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(201,169,110,0.06)_0%,transparent_70%)] pointer-events-none z-0 animate-drift"></div>
      <div className="absolute -bottom-20 -left-20 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(201,169,110,0.05)_0%,transparent_70%)] pointer-events-none z-0 animate-drift-reverse"></div>
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(201,169,110,0.04)_0%,transparent_70%)] pointer-events-none z-0 animate-drift [animation-delay:4s] opacity-70"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(201,169,110,0.04)_0%,transparent_70%)] pointer-events-none z-0 animate-drift-reverse [animation-delay:8s] opacity-80"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">

        {/* Main Title and Copy */}
        <div className="max-w-4xl space-y-8 reveal-on-scroll mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="badge-premium tracking-widest font-mono text-[9px] py-1 px-3.5 bg-accent/5 rounded-full border border-accent/25 shadow-[0_0_25px_rgba(201,169,110,0.38)]">
              ORACLE CRITICAL ENGINEERING
            </span>
            <span className="h-[1px] w-12 bg-accent/20 hidden sm:block"></span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif text-white font-light leading-[1.1] tracking-tight drop-shadow-[0_2px_20px_rgba(201,169,110,0.22)]">
            Migramos tu ERP a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF5E0] to-accent font-normal italic">Oracle Fusion Cloud.</span> <br />
            Y no nos vamos hasta que tu primer cierre contable opere.
          </h1>

          <div className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed space-y-4 font-sans font-light">
            <div className="border-l-2 border-accent/25 pl-4 py-1 bg-zinc-950/20 rounded-r-xl">
              El <strong className="text-white font-medium">73% de las implementaciones</strong> Oracle Fusion celebran el &quot;go-live&quot; y abandonan al cliente con cierres contables pesados, reportes manuales paralelos e incidencias críticas abiertas.
            </div>
            <p className="text-zinc-300">
              Nosotros nos quedamos en tu trinchera operativa hasta que tu primer ciclo crítico —sea cierre contable o facturación masiva— opera en producción sin incidencias. <span className="text-accent font-mono font-bold tracking-wider">[ POR CONTRATO ]</span>.
            </p>
          </div>

          {/* Buttons and CTAs */}
          <div className="flex flex-wrap gap-4 items-center pt-2">
            <a href="#terminal" className="btn-primary-accent group shadow-[0_0_35px_rgba(201,169,110,0.45)] hover:shadow-[0_0_45px_rgba(201,169,110,0.65)] relative overflow-hidden rounded-full">
              <span className="relative z-10 flex items-center gap-2">
                Iniciar conversación
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-accent via-white/20 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </a>
            <a href="#comparadores" className="btn-outline-accent rounded-full hover:shadow-[0_0_25px_rgba(201,169,110,0.35)]">
              Calcular ahorro de migración
            </a>
          </div>

          {/* Pre-qualification HUD Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-900 bg-zinc-950/80 rounded-lg font-mono text-[9px] text-zinc-500 tracking-wider shadow-[0_0_20px_rgba(201,169,110,0.25)]">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_var(--accent)]" />
            <span>ADMISIÓN RESTRINGIDA A INICIATIVAS CON FACTURACIÓN ANUAL &gt; USD 50M</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.15)_0%,transparent_80%)] my-16"></div>

        {/* Rescue Counter Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono reveal-on-scroll reveal-delay-300">
          {[
            {
              num: "02",
              label: "PROYECTOS",
              desc: "De rescate y remediación Fusion estabilizados en producción al 100%.",
              icon: Clock,
              progress: 100,
              progressText: "INTEGRIDAD DE TRANSACCIONES"
            },
            {
              num: "3.8K+",
              label: "HORAS",
              desc: "De ingeniería de sistemas y bases de datos Oracle aplicadas a mitigación de riesgos.",
              icon: Activity,
              progress: 85,
              progressText: "AUDITORÍA Y TELEMETRÍA ACTIVA"
            },
            {
              num: "15+",
              label: "AÑOS",
              desc: "De experiencia promedio por consultor senior asignado a tu proyecto de remediación.",
              icon: Award,
              progress: 95,
              progressText: "ACREDITACIÓN DE INGENIEROS"
            }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="p-6 border border-accent/15 bg-zinc-950/45 rounded-2xl relative overflow-hidden group hover:border-accent/35 transition-colors shadow-[0_0_15px_rgba(201,169,110,0.03)]">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/3 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl md:text-5xl font-light text-accent tracking-tight drop-shadow-[0_2px_15px_rgba(201,169,110,0.55)]">{stat.num}</span>
                    <span className="text-accent/90 text-[10px] font-bold ml-2 tracking-wider drop-shadow-[0_0_8px_rgba(201,169,110,0.3)]">{stat.label}</span>
                  </div>
                  <div className="p-2 border border-accent/20 bg-zinc-900/40 text-accent/80 rounded-xl group-hover:text-accent group-hover:border-accent/45 transition-colors shadow-[0_0_10px_rgba(201,169,110,0.15)]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-zinc-400 text-[11px] leading-relaxed mb-4 min-h-[32px] font-sans font-light">
                  {stat.desc}
                </p>

                {/* Tech Micro-Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[8px] text-accent/80 font-bold tracking-wider drop-shadow-[0_0_6px_rgba(201,169,110,0.25)]">
                    <span>{stat.progressText}</span>
                    <span>{stat.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent/50 to-accent rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(201,169,110,0.5)]"
                      style={{ width: `${stat.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </header>
  );
}
