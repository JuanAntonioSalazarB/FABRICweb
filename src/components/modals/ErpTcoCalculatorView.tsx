"use client";

import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function ErpTcoCalculatorView() {
  const [currentLicenses, setCurrentLicenses] = useState(120000);
  const [currentInfra, setCurrentInfra] = useState(80000);
  const [currentSupport, setCurrentSupport] = useState(60000);
  const [currentConsultants, setCurrentConsultants] = useState(150000);

  const currentAnnualTotal = currentLicenses + currentInfra + currentSupport + currentConsultants;
  
  const oracleLicenses = Math.round(currentLicenses * 0.7);
  const oracleInfra = 0;
  const oracleSupport = Math.round(oracleLicenses * 0.22);
  const oracleConsultants = Math.round(currentConsultants * 0.35);
  
  const oracleAnnualTotal = oracleLicenses + oracleInfra + oracleSupport + oracleConsultants;
  const annualSavings = currentAnnualTotal - oracleAnnualTotal;
  const migrationCost = Math.round(currentAnnualTotal * 1.1);

  const savings3Yr = annualSavings * 3 - migrationCost;
  const savings5Yr = annualSavings * 5 - migrationCost;
  const savings10Yr = annualSavings * 10 - migrationCost;

  const breakEvenMonth = annualSavings > 0 ? Math.round((migrationCost / (annualSavings / 12))) : 0;

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-premium mb-2 inline-block">FINANCIAL SIMULATOR</span>
        <h2 className="text-2xl font-serif text-white font-light">ERP TCO Calculator</h2>
        <p className="text-zinc-500 text-xs mt-1">Proyecta los costos de licenciamiento, soporte e infraestructura actual frente a Oracle Fusion Cloud.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Licencias Anuales ERP (USD)</span>
              <span className="text-white font-bold">${currentLicenses.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="800000"
              step="10000"
              value={currentLicenses}
              onChange={(e) => setCurrentLicenses(Number(e.target.value))}
              className="w-full accent-accent bg-zinc-900 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Servidores / Cloud / Data Center (USD/año)</span>
              <span className="text-white font-bold">${currentInfra.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={currentInfra}
              onChange={(e) => setCurrentInfra(Number(e.target.value))}
              className="w-full accent-accent bg-zinc-900 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Soporte Anual / Mantenimiento Base (USD)</span>
              <span className="text-white font-bold">${currentSupport.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="5000"
              value={currentSupport}
              onChange={(e) => setCurrentSupport(Number(e.target.value))}
              className="w-full accent-accent bg-zinc-900 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Consultores Externos / Soporte L3 (USD/año)</span>
              <span className="text-white font-bold">${currentConsultants.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="1000000"
              step="10000"
              value={currentConsultants}
              onChange={(e) => setCurrentConsultants(Number(e.target.value))}
              className="w-full accent-accent bg-zinc-900 cursor-pointer"
            />
          </div>
        </div>

        <div className="md:col-span-5 space-y-6 font-mono text-xs">
          <div className="border border-accent/20 p-5 bg-accent/5 space-y-4">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Costo ERP Actual (Anual)</span>
              <span className="text-xl text-zinc-400 font-light">${currentAnnualTotal.toLocaleString()} USD</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Costo Estimado Oracle SaaS</span>
              <span className="text-xl text-accent font-light">${oracleAnnualTotal.toLocaleString()} USD</span>
            </div>
            <div className="border-t border-[rgba(201,169,110,0.15)] pt-3">
              <span className="text-[10px] text-zinc-500 block uppercase">Ahorro Neto Recurrente</span>
              <span className="text-2xl text-emerald-500 font-bold">${annualSavings.toLocaleString()} USD/año</span>
            </div>
          </div>

          <div className="space-y-2 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Costo de Migración Est.</span>
              <span className="text-white font-bold">${migrationCost.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between">
              <span>Punto de Retorno (ROI)</span>
              <span className="text-emerald-500 font-bold">Mes {breakEvenMonth}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-800 pt-2">
              <span>Ahorro Acumulado 5 Años</span>
              <span className="text-accent font-bold">${savings5Yr.toLocaleString()} USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
