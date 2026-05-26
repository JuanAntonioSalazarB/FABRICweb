"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldAlert, Layers, Cpu, Clock, Activity, Award } from 'lucide-react';

interface HeroProps {
  setActiveOverlayModal?: (modal: 'erp' | 'cloud' | 'diagnostico' | 'office-hours' | 'ape-plazas' | 'aplazo' | 'doctrina' | 'transparencia' | null) => void;
}

export default function Hero({ setActiveOverlayModal }: HeroProps) {
  const [activePriority, setActivePriority] = useState<number | null>(null);

  return (
    <header id="inicio" className="relative overflow-hidden pt-28 md:pt-36 pb-20 border-b border-[rgba(201,169,110,0.15)] bg-black">
      {/* HUD Architectural Grids and Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"></div>
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(201,169,110,0.04)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(201,169,110,0.03)_0%,transparent_70%)] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Title and Copy */}
          <div className="lg:col-span-7 space-y-8 reveal-on-scroll">
            <div className="inline-flex items-center gap-2">
              <span className="badge-premium tracking-widest font-mono text-[9px] py-1 px-3.5 bg-accent/5 rounded-full border border-accent/25 shadow-[0_0_15px_rgba(201,169,110,0.1)]">
                ORACLE CRITICAL ENGINEERING
              </span>
              <span className="h-[1px] w-12 bg-accent/20 hidden sm:block"></span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif text-white font-light leading-[1.1] tracking-tight">
              Migramos tu ERP a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF5E0] to-accent font-normal italic">Oracle Fusion Cloud.</span> <br />
              <span className="relative">
                Y no nos vamos
                <span className="absolute bottom-1.5 left-0 w-full h-[2px] bg-accent/40 rounded-full blur-[1px]"></span>
              </span> hasta que tu primer cierre contable opere.
            </h1>
            
            <div className="max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed space-y-4 font-sans font-light">
              <div className="border-l-2 border-accent/25 pl-4 py-1 bg-zinc-950/20 rounded-r-xl">
                El <strong className="text-white font-medium">73% de las implementaciones</strong> Oracle Fusion celebran el &quot;go-live&quot; y abandonan al cliente con cierres contables pesados, reportes manuales paralelos e incidencias críticas abiertas.
              </div>
              <p className="text-zinc-300">
                Nosotros nos quedamos en tu trinchera operativa hasta que tu primer ciclo crítico —sea cierre contable o facturación masiva— opera en producción sin incidencias. <span className="text-accent font-mono font-bold tracking-wider">[ POR CONTRATO ]</span>.
              </p>
            </div>

            {/* Buttons and CTAs */}
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <a href="#terminal" className="btn-primary-accent group shadow-[0_4px_20px_rgba(201,169,110,0.15)] relative overflow-hidden rounded-full">
                <span className="relative z-10 flex items-center gap-2">
                  Iniciar conversación 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-accent via-white/20 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              </a>
              <a href="#comparadores" className="btn-outline-accent rounded-full hover:shadow-[0_0_15px_rgba(201,169,110,0.08)]">
                Calcular ahorro de migración
              </a>
            </div>

            {/* Pre-qualification HUD Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-900 bg-zinc-950/80 rounded-lg font-mono text-[9px] text-zinc-500 tracking-wider">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_var(--accent)]" />
              <span>ADMISIÓN RESTRINGIDA A INICIATIVAS CON FACTURACIÓN ANUAL &gt; USD 50M</span>
            </div>
          </div>

          {/* Interactive Status Sidebar */}
          <div className="lg:col-span-5 space-y-4 reveal-on-scroll reveal-delay-200">
            <span className="font-mono text-zinc-500 text-[10px] tracking-widest block uppercase font-bold pl-1">
              // MÓDULOS DE ATENCIÓN DE MIGRACIÓN:
            </span>
            
            <div className="space-y-3">
              {[
                { 
                  id: 1, 
                  title: "Rescate de Fusion Fallido", 
                  desc: "Estabilización y remediación de implementaciones inconclusas, lentas o con reportes manuales.",
                  icon: ShieldAlert,
                  status: "ACCIÓN INMEDIATA",
                  color: "hover:border-red-500/40 hover:bg-red-950/5 hover:shadow-[0_0_20px_rgba(239,68,68,0.05)]",
                  badge: "border-red-500/25 bg-red-950/20 text-red-400"
                },
                { 
                  id: 2, 
                  title: "Migraciones Legacy", 
                  desc: "Transición controlada desde SAP ECC/S4, Oracle EBS R12, JD Edwards y PeopleSoft.",
                  icon: Layers,
                  status: "MIGRACIÓN ORDENADA",
                  color: "hover:border-sky-500/40 hover:bg-sky-950/5 hover:shadow-[0_0_20px_rgba(56,189,248,0.05)]",
                  badge: "border-sky-500/25 bg-sky-950/20 text-sky-400"
                },
                { 
                  id: 3, 
                  title: "Implementaciones Greenfield", 
                  desc: "Configuración limpia directa para corporativos en crecimiento acelerado sin ERP previo.",
                  icon: Cpu,
                  status: "ESTANDARIZACIÓN",
                  color: "hover:border-emerald-500/40 hover:bg-emerald-950/5 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)]",
                  badge: "border-emerald-500/25 bg-emerald-950/20 text-emerald-400"
                }
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = activePriority === item.id;
                
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActivePriority(item.id)}
                    onMouseLeave={() => setActivePriority(null)}
                    className={`p-4 border border-zinc-900 bg-zinc-950/30 rounded-2xl transition-all duration-300 cursor-pointer ${item.color} ${
                      isActive ? 'border-accent/40 bg-zinc-950/60 shadow-[0_4px_25px_rgba(201,169,110,0.03)]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 border rounded-lg transition-colors ${
                          isActive ? 'border-accent/30 bg-accent/5 text-accent' : 'border-zinc-800 bg-zinc-900/40 text-zinc-500'
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h4 className="font-mono text-white text-xs font-bold tracking-wide">{item.title}</h4>
                      </div>
                      <span className={`font-mono text-[8px] px-2 py-0.5 border rounded-full tracking-wider font-bold ${item.badge}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[11px] leading-normal pl-9 font-sans font-light">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
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
              <div key={idx} className="p-6 border border-zinc-900 bg-zinc-950/45 rounded-2xl relative overflow-hidden group hover:border-accent/20 transition-colors">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/2 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl md:text-5xl font-light text-white tracking-tight">{stat.num}</span>
                    <span className="text-accent text-[10px] font-bold ml-2 tracking-wider">{stat.label}</span>
                  </div>
                  <div className="p-2 border border-zinc-800 bg-zinc-900/40 text-zinc-500 rounded-xl group-hover:text-accent group-hover:border-accent/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-zinc-500 text-[11px] leading-relaxed mb-4 min-h-[32px] font-sans font-light">
                  {stat.desc}
                </p>

                {/* Tech Micro-Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[8px] text-zinc-600 font-bold">
                    <span>{stat.progressText}</span>
                    <span>{stat.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent/40 to-accent rounded-full transition-all duration-1000"
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
