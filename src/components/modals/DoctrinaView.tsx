"use client";

import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

export default function DoctrinaView() {
  return (
    <div className="space-y-6">
      <div>
        <span className="badge-premium mb-2 inline-block">FABRIC OPERATING PRINCIPLES</span>
        <h2 className="text-2xl font-serif text-white font-light">Nuestra Doctrina de Ingeniería Crítica</h2>
        <p className="text-zinc-500 text-xs mt-1">Garantías y compromisos no negociables respaldados legalmente por contrato.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-mono">
        <div className="md:col-span-8 text-zinc-400 space-y-6 font-sans text-sm leading-relaxed">
          <div className="space-y-2">
            <h4 className="text-accent font-mono text-xs font-bold uppercase">1. Entrega en primer ciclo crítico</h4>
            <p className="text-zinc-400 text-xs font-sans">
              El proyecto no se entrega en el go-live. Se entrega cuando tu primer cierre contable, primer ciclo operativo o primer ciclo regulatorio crítico opera en producción con estabilidad documentada.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-accent font-mono text-xs font-bold uppercase">2. Solo seniors. Cero juniors facturables.</h4>
            <p className="text-zinc-400 text-xs font-sans">
              Cada consultor de FABRIC tiene mínimo 8 años de experiencia real en Oracle. Sin excepciones.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-accent font-mono text-xs font-bold uppercase">3. Fixed-Price por fase. Cero sorpresas.</h4>
            <p className="text-zinc-400 text-xs font-sans">
              Operamos con presupuestos cerrados. Si nos atrasamos por nuestra causa, no facturamos las semanas adicionales.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-accent font-mono text-xs font-bold uppercase">4. Cero reportes manuales post go-live.</h4>
            <p className="text-zinc-400 text-xs font-sans">
              Al cierre del primer ciclo crítico, ningún reporte ejecutivo, financiero u operativo debe ejecutarse fuera del ERP. Si subsiste un reporte manual paralelo por causa atribuible a FABRIC, se resuelve sin costo adicional hasta su eliminación.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-accent font-mono text-xs font-bold uppercase">5. Transición formal con documentación viva.</h4>
            <p className="text-zinc-400 text-xs font-sans">
              El cierre del proyecto se documenta con acta formal firmada por todos los stakeholders del cliente. El acta incluye: tablero de KPIs verificado, incidencias resueltas, adopción de usuarios clave medida, plan de soporte post-transición, y entrega de documentación viva (configuraciones, integraciones, runbooks, procedimientos de cierre, matrices de roles) auditable y actualizable por el cliente sin dependencia de FABRIC.
            </p>
          </div>
        </div>

        <div className="md:col-span-4 space-y-4">
          <div className="border border-accent p-5 bg-accent/5 space-y-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-accent">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-bold">GARANTÍA CONTRACTUAL</span>
            </div>
            <p className="text-zinc-300 italic text-[11px] font-sans">
              &quot;Si no logramos estabilizar tu primer cierre contable en producción en la fecha acordada por causas de nuestra ingeniería, no facturamos los servicios de estabilización hasta lograrlo.&quot;
            </p>
            <span className="text-[9px] text-zinc-500 block">— Cláusula 7.2 de Servicios</span>
          </div>

          <div className="p-4 border border-zinc-800 bg-zinc-950/50 text-[10px] text-zinc-500 font-mono leading-normal flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Sólo trabajamos con clientes comprometidos con nuestra doctrina técnica de ingeniería.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
