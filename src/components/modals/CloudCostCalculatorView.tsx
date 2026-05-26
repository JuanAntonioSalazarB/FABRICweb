"use client";

import React, { useState } from 'react';
import { Server, Search, ArrowRight, HelpCircle, Check, AlertCircle } from 'lucide-react';

interface Workload {
  id: string;
  name: string;
  provider: 'OCI' | 'AWS' | 'Azure' | 'GCP';
  compute: number;
  storage: number;
  database: number;
  egress: number;
  features: string[];
  notes: string;
}

const DEMO_WORKLOADS: Record<string, Workload> = {
  'OCI-FIN-993': {
    id: 'OCI-FIN-993',
    name: 'Core ERP Financiero (Large-scale)',
    provider: 'OCI',
    compute: 25000,
    storage: 12000,
    database: 35000,
    egress: 1000,
    features: [
      'Exadata Cloud Service nativo habilitado',
      'Soporte de base de datos Oracle RAC (Active-Active clustering)',
      'Conectividad FastConnect dedicada',
      'Latencias de base de datos ultra bajas (< 1ms)',
      '10 TB de transferencia saliente mensual incluida sin costo extra'
    ],
    notes: 'Despliegue de misión crítica que requiere alto rendimiento transaccional y disponibilidad continua para el cierre contable.'
  },
  'AWS-RTL-442': {
    id: 'AWS-RTL-442',
    name: 'Portal de Retail E-Commerce (Medium-High traffic)',
    provider: 'AWS',
    compute: 30000,
    storage: 18000,
    database: 25000,
    egress: 15000,
    features: [
      'Autoscaling EC2 detrás de Application Load Balancer',
      'Amazon Aurora Serverless v2 con réplicas de lectura',
      'Alta dependencia de AWS CloudFront CDN',
      'Egress excesivo debido a descargas de assets de imágenes y APIs',
      'Alta disponibilidad multi-zona (Multi-AZ)'
    ],
    notes: 'Workload con picos de tráfico estacionales. El costo de egress representa un porcentaje desproporcionado del gasto total de red.'
  },
  'AZR-HLT-105': {
    id: 'AZR-HLT-105',
    name: 'Sistema de Salud e Historial Clínico (EMR)',
    provider: 'Azure',
    compute: 18000,
    storage: 22000,
    database: 20000,
    egress: 8000,
    features: [
      'Despliegue en zona de cumplimiento estricto (HIPAA/HITRUST)',
      'Alto volumen de imágenes médicas (PACS) almacenadas en Blob Storage',
      'Base de datos SQL Managed Instance de misión crítica',
      'Conexión ExpressRoute de respaldo a data centers locales',
      'Replicación geo-redundante para desastres (GRS)'
    ],
    notes: 'Entorno altamente seguro y enfocado en compliance con gran peso en almacenamiento de archivos binarios grandes.'
  },
  'GCP-DAT-881': {
    id: 'GCP-DAT-881',
    name: 'Framework de Analítica y Big Data',
    provider: 'GCP',
    compute: 40000,
    storage: 35000,
    database: 15000,
    egress: 25000,
    features: [
      'Cientos de nodos de Kubernetes auto-escalables en GKE',
      'BigQuery para consultas masivas de datos semi-estructurados',
      'Transmisión continua (Ingest) con Cloud Pub/Sub',
      'Enorme tráfico de red de salida (Egress) para reportes y APIs externas',
      'Procesamiento distribuido masivo de logs y telemetría'
    ],
    notes: 'Workload analítico enfocado en ingesta de millones de eventos por segundo y exportaciones a sistemas BI externos.'
  }
};

const MULTIPLIERS = {
  OCI: { compute: 1.0, storage: 1.0, database: 1.0, egress: 1.0 },
  AWS: { compute: 1.43, storage: 1.66, database: 2.0, egress: 10.0 },
  Azure: { compute: 1.35, storage: 1.50, database: 1.8, egress: 9.0 },
  GCP: { compute: 1.30, storage: 1.40, database: 1.6, egress: 8.5 }
};

const PROVIDER_TECH_HIGHS: Record<string, string[]> = {
  OCI: [
    'Exadata Database Cloud Service con RAC (Active-Active)',
    'FastConnect privado con egress extremadamente económico (10TB free)',
    'Performance garantizada con SLAs respaldados por contratos'
  ],
  AWS: [
    'Amazon Aurora Serverless con réplicas multizona',
    'Amplio ecosistema de add-ons de terceros en AWS Marketplace',
    'Egress tarificado a $0.09 USD/GB tras primer umbral'
  ],
  Azure: [
    'Azure SQL Managed Instance con compatibilidad nativa SQL Server',
    'Integración directa con Directorio Activo (Entra ID)',
    'ExpressRoute privado para entornos híbridos'
  ],
  GCP: [
    'GKE (Google Kubernetes Engine) para orquestación de contenedores',
    'BigQuery para analítica masiva serverless de alta velocidad',
    'Interconexión de red global de baja latencia'
  ]
};

export default function CloudCostCalculatorView() {
  const [activeTab, setActiveTab] = useState<'general' | 'id'>('general');

  // Tab 1: General Slider States
  const [provider, setProvider] = useState('AWS');
  const [computeCost, setComputeCost] = useState(5000);
  const [storageCost, setStorageCost] = useState(3000);
  const [databaseCost, setDatabaseCost] = useState(6000);
  const [egressCost, setEgressCost] = useState(2500);

  // Tab 2: ID Search States
  const [searchId, setSearchId] = useState('');
  const [matchedWorkload, setMatchedWorkload] = useState<Workload | null>(null);
  const [compareProvider, setCompareProvider] = useState<'OCI' | 'AWS' | 'Azure' | 'GCP' | null>(null);

  // Tab 1 calculations
  const currentMonthlyTotal = computeCost + storageCost + databaseCost + egressCost;
  const ociCompute = Math.round(computeCost * 0.7);
  const ociStorage = Math.round(storageCost * 0.6);
  const ociDatabase = Math.round(databaseCost * 0.5);
  const ociEgress = Math.round(egressCost * 0.1);
  const ociMonthlyTotal = ociCompute + ociStorage + ociDatabase + ociEgress;
  const monthlySavings = currentMonthlyTotal - ociMonthlyTotal;
  const annualSavings = monthlySavings * 12;

  // Handle Search ID input change
  const handleIdSearch = (id: string) => {
    setSearchId(id);
    const cleaned = id.trim().toUpperCase();
    if (DEMO_WORKLOADS[cleaned]) {
      const wk = DEMO_WORKLOADS[cleaned];
      setMatchedWorkload(wk);
      // Auto-set comparison provider to OCI if original is not OCI, otherwise to AWS
      setCompareProvider(wk.provider === 'OCI' ? 'AWS' : 'OCI');
    } else {
      setMatchedWorkload(null);
      setCompareProvider(null);
    }
  };

  // Tab 2 calculations helper
  const calculateEquivalent = (
    value: number,
    category: 'compute' | 'storage' | 'database' | 'egress',
    from: 'OCI' | 'AWS' | 'Azure' | 'GCP',
    to: 'OCI' | 'AWS' | 'Azure' | 'GCP'
  ) => {
    const ociBase = value / MULTIPLIERS[from][category];
    return Math.round(ociBase * MULTIPLIERS[to][category]);
  };

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Header */}
      <div>
        <span className="badge-premium mb-2 inline-block">INFRASTRUCTURE COST SIMULATOR</span>
        <h2 className="text-2xl font-serif text-white font-light">Cloud Cost Comparator</h2>
        <p className="text-zinc-500 text-xs mt-1">Calcula y compara los costos y arquitecturas de tu infraestructura cloud.</p>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-3 border-b-2 text-center cursor-pointer transition-all duration-300 font-bold uppercase tracking-wider ${
            activeTab === 'general'
              ? 'border-accent text-accent bg-accent/5'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          [ DÓNDE ESTAMOS VIENDO ]
        </button>
        <button
          onClick={() => setActiveTab('id')}
          className={`px-6 py-3 border-b-2 text-center cursor-pointer transition-all duration-300 font-bold uppercase tracking-wider ${
            activeTab === 'id'
              ? 'border-accent text-accent bg-accent/5'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          [ COMPARAR CON ID ]
        </button>
      </div>

      {/* General Tab View */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fadeIn">
          {/* Left panel: sliders */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 block">Proveedor Actual:</label>
              <div className="grid grid-cols-3 gap-2">
                {['AWS', 'Azure', 'GCP'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProvider(p)}
                    className={`p-2.5 border text-center transition-colors cursor-pointer ${
                      provider === p ? 'border-accent text-accent bg-accent/5' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Compute / Instancias Virtuales (USD/mes)</span>
                <span className="text-white font-bold">${computeCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={computeCost}
                onChange={(e) => setComputeCost(Number(e.target.value))}
                className="w-full accent-accent bg-zinc-900 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Almacenamiento / SSD / Backup (USD/mes)</span>
                <span className="text-white font-bold">${storageCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="300"
                max="30000"
                step="300"
                value={storageCost}
                onChange={(e) => setStorageCost(Number(e.target.value))}
                className="w-full accent-accent bg-zinc-900 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Database PaaS (RDS / Managed SQL)</span>
                <span className="text-white font-bold">${databaseCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={databaseCost}
                onChange={(e) => setDatabaseCost(Number(e.target.value))}
                className="w-full accent-accent bg-zinc-900 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Red / Egress / Ancho de Banda Saliente (USD/mes)</span>
                <span className="text-white font-bold">${egressCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="20000"
                step="100"
                value={egressCost}
                onChange={(e) => setEgressCost(Number(e.target.value))}
                className="w-full accent-accent bg-zinc-900 cursor-pointer"
              />
            </div>
          </div>

          {/* Right panel: results */}
          <div className="md:col-span-5 space-y-6">
            <div className="border border-accent/20 p-5 bg-accent/5 space-y-4">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Costo Mensual {provider}</span>
                <span className="text-xl text-zinc-400 font-light">${currentMonthlyTotal.toLocaleString()} USD</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Costo Mensual OCI Equiv.</span>
                <span className="text-xl text-accent font-light">${ociMonthlyTotal.toLocaleString()} USD</span>
              </div>
              <div className="border-t border-[rgba(201,169,110,0.15)] pt-3">
                <span className="text-[10px] text-zinc-500 block uppercase">Ahorro Mensual Neto</span>
                <span className="text-2xl text-emerald-500 font-bold">${monthlySavings.toLocaleString()} USD/mes</span>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-zinc-400">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Ahorro Anual Proyectado</span>
                <span className="text-emerald-500 font-bold">${annualSavings.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Eficiencia OCI Estimada</span>
                <span className="text-accent font-bold">~{Math.round((monthlySavings / currentMonthlyTotal) * 100)}% menos</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ID Tab View */}
      {activeTab === 'id' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search bar */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <label className="text-[10px] text-zinc-500 block uppercase font-bold">Ingresar ID de Nube Demo</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => handleIdSearch(e.target.value)}
                  placeholder="Ej. AWS-RTL-442 o OCI-FIN-993"
                  className="w-full bg-black border border-zinc-800 text-white pl-10 pr-4 py-2 outline-none focus:border-accent font-mono text-xs placeholder:text-zinc-700"
                />
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 md:w-[320px]">
              <HelpCircle className="w-4 h-4 text-accent shrink-0" />
              <span>IDs disponibles: OCI-FIN-993, AWS-RTL-442, AZR-HLT-105, GCP-DAT-881. Características en nubes_demo_ids.txt.</span>
            </div>
          </div>

          {/* Result content */}
          {!matchedWorkload ? (
            <div className="border border-dashed border-zinc-800 p-12 text-center text-zinc-600 rounded">
              <Server className="w-8 h-8 mx-auto mb-3 text-zinc-800" />
              <p>Esperando ID de nube demo válido para iniciar comparación...</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {Object.keys(DEMO_WORKLOADS).map(id => (
                  <button
                    key={id}
                    onClick={() => handleIdSearch(id)}
                    className="px-2.5 py-1 text-[10px] border border-zinc-800 hover:border-accent text-zinc-400 hover:text-accent cursor-pointer transition-colors bg-transparent"
                  >
                    {id} ({DEMO_WORKLOADS[id].provider})
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Workload Info */}
              <div className="lg:col-span-4 border border-zinc-800 p-5 bg-zinc-950/60 space-y-4">
                <div>
                  <span className="badge-premium text-[9px] mb-2 inline-block">NUBE ENCONTRADA</span>
                  <h3 className="text-sm font-bold text-white font-serif">{matchedWorkload.name}</h3>
                  <p className="text-zinc-500 text-[10px] mt-1 italic">ID: {matchedWorkload.id}</p>
                </div>

                <div className="border-t border-zinc-900 pt-3 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Proveedor Original:</span>
                    <span className="text-accent font-bold">{matchedWorkload.provider}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Costo Original Total:</span>
                    <span className="text-white font-bold">${(matchedWorkload.compute + matchedWorkload.storage + matchedWorkload.database + matchedWorkload.egress).toLocaleString()} USD</span>
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-3">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold mb-2">Arquitectura Actual:</span>
                  <ul className="space-y-1 text-[10px] text-zinc-400">
                    {matchedWorkload.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-accent select-none shrink-0">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Comparative Grid */}
              <div className="lg:col-span-8 space-y-6">
                {/* Select target cloud */}
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 block uppercase font-bold">Seleccione Proveedor para Comparar:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['OCI', 'AWS', 'Azure', 'GCP'] as const).map(p => {
                      const isDisabled = p === matchedWorkload.provider;
                      const isSelected = compareProvider === p;
                      return (
                        <button
                          key={p}
                          disabled={isDisabled}
                          onClick={() => setCompareProvider(p)}
                          className={`p-2 border text-center transition-colors font-bold ${
                            isDisabled
                              ? 'border-zinc-900/40 text-zinc-800 cursor-not-allowed bg-transparent'
                              : isSelected
                              ? 'border-accent text-accent bg-accent/5 cursor-pointer'
                              : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 cursor-pointer bg-transparent'
                          }`}
                        >
                          {p} {isDisabled ? '(Actual)' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {compareProvider && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Comparative Table */}
                    <div className="border border-zinc-800 overflow-x-auto bg-black">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-950/60 font-bold">
                            <th className="p-3 text-zinc-400">Aspecto de Costo</th>
                            <th className="p-3 text-zinc-400 text-right">{matchedWorkload.provider} (Original)</th>
                            <th className="p-3 text-accent text-right">{compareProvider} (Comparado)</th>
                            <th className="p-3 text-right">Diferencia</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {(['compute', 'storage', 'database', 'egress'] as const).map(cat => {
                            const origVal = matchedWorkload[cat];
                            const compVal = calculateEquivalent(origVal, cat, matchedWorkload.provider, compareProvider);
                            const diff = compVal - origVal;
                            const diffPct = Math.round((diff / origVal) * 100);
                            return (
                              <tr key={cat} className="hover:bg-zinc-950/20 text-[11px]">
                                <td className="p-3 text-zinc-300 font-bold capitalize">{cat === 'compute' ? 'Compute / VMs' : cat === 'storage' ? 'Almacenamiento' : cat === 'database' ? 'Base de Datos' : 'Red / Egress'}</td>
                                <td className="p-3 text-right text-zinc-400">${origVal.toLocaleString()}</td>
                                <td className="p-3 text-right text-white font-bold">${compVal.toLocaleString()}</td>
                                <td className={`p-3 text-right font-bold ${diff < 0 ? 'text-emerald-500' : diff > 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                                  {diff < 0 ? '-' : diff > 0 ? '+' : ''}${Math.abs(diff).toLocaleString()} ({diffPct > 0 ? '+' : ''}{diffPct}%)
                                </td>
                              </tr>
                            );
                          })}
                          
                          {/* Totals */}
                          {(() => {
                            const origTotal = matchedWorkload.compute + matchedWorkload.storage + matchedWorkload.database + matchedWorkload.egress;
                            const compTotal =
                              calculateEquivalent(matchedWorkload.compute, 'compute', matchedWorkload.provider, compareProvider) +
                              calculateEquivalent(matchedWorkload.storage, 'storage', matchedWorkload.provider, compareProvider) +
                              calculateEquivalent(matchedWorkload.database, 'database', matchedWorkload.provider, compareProvider) +
                              calculateEquivalent(matchedWorkload.egress, 'egress', matchedWorkload.provider, compareProvider);
                            const totalDiff = compTotal - origTotal;
                            const totalDiffPct = Math.round((totalDiff / origTotal) * 100);
                            
                            return (
                              <>
                                <tr className="border-t-2 border-zinc-800 bg-zinc-950 font-bold text-[12px]">
                                  <td className="p-3 text-zinc-300">Costo Mensual Total</td>
                                  <td className="p-3 text-right text-zinc-400">${origTotal.toLocaleString()}</td>
                                  <td className="p-3 text-right text-accent">${compTotal.toLocaleString()}</td>
                                  <td className={`p-3 text-right ${totalDiff < 0 ? 'text-emerald-500' : totalDiff > 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                                    {totalDiff < 0 ? '-' : totalDiff > 0 ? '+' : ''}${Math.abs(totalDiff).toLocaleString()} ({totalDiffPct > 0 ? '+' : ''}{totalDiffPct}%)
                                  </td>
                                </tr>
                                <tr className="bg-zinc-950/40 text-[11px]">
                                  <td className="p-3 text-zinc-500">Costo Anual Proyectado</td>
                                  <td className="p-3 text-right text-zinc-600">${(origTotal * 12).toLocaleString()}</td>
                                  <td className="p-3 text-right text-zinc-300 font-bold">${(compTotal * 12).toLocaleString()}</td>
                                  <td className={`p-3 text-right font-bold ${totalDiff < 0 ? 'text-emerald-500' : totalDiff > 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                                    {totalDiff < 0 ? 'Ahorro' : 'Premium'}: ${Math.abs(totalDiff * 12).toLocaleString()} USD/año
                                  </td>
                                </tr>
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* Technical Comparison Block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Original Provider Technical notes */}
                      <div className="border border-zinc-800 p-4 bg-zinc-950/30">
                        <h4 className="text-[10px] text-zinc-500 uppercase font-bold mb-2 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
                          Consideraciones en {matchedWorkload.provider}
                        </h4>
                        <ul className="space-y-2 text-[10px] text-zinc-400">
                          {PROVIDER_TECH_HIGHS[matchedWorkload.provider]?.map((h, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-zinc-600 shrink-0">▪</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: Target Provider Technical notes */}
                      <div className="border border-accent/20 p-4 bg-accent/5">
                        <h4 className="text-[10px] text-accent uppercase font-bold mb-2 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-accent" />
                          Cambios de Arquitectura en {compareProvider}
                        </h4>
                        <ul className="space-y-2 text-[10px] text-zinc-300">
                          {PROVIDER_TECH_HIGHS[compareProvider]?.map((h, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-accent shrink-0">▪</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Analytical Insight */}
                    <div className="p-4 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-500 leading-relaxed">
                      <span className="font-bold text-accent block mb-1">FABRIC OS INSIGHT:</span>
                      {compareProvider === 'OCI' && (
                        <span>
                          Al migrar esta carga de trabajo de {matchedWorkload.provider} a OCI, la mayor reducción de costos se da en Base de Datos (-50%) debido al uso de Exadata Cloud Service y en Red / Egress (-90%) gracias al esquema de red de Oracle. Esto elimina la penalización por crecimiento de datos típica en otras nubes.
                        </span>
                      )}
                      {compareProvider !== 'OCI' && matchedWorkload.provider === 'OCI' && (
                        <span>
                          Migrar esta carga optimizada de OCI a {compareProvider} representa una prima de costo de aproximadamente el {Math.round((calculateEquivalent(matchedWorkload.database, 'database', 'OCI', compareProvider) - matchedWorkload.database) / matchedWorkload.database * 100)}% en base de datos al perder las eficiencias de Exadata y RAC. Adicionalmente, los costos de egress saliente aumentarán sustancialmente ({compareProvider === 'AWS' ? '10x' : compareProvider === 'Azure' ? '9x' : '8.5x'}).
                        </span>
                      )}
                      {matchedWorkload.provider !== 'OCI' && compareProvider !== 'OCI' && (
                        <span>
                          La comparación entre {matchedWorkload.provider} y {compareProvider} muestra diferencias marginales en compute y storage, pero los modelos de licenciamiento de base de datos y tasas de transferencia saliente siguen siendo las áreas críticas donde el gasto de hosting se desborda en ambos proveedores tradicionales.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
