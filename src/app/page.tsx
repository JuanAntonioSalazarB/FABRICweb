"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FileText, X, Globe } from 'lucide-react';
import { submitEvidenceRequestAction } from '@/app/actions/leads';

// Modal and wizard views
import ErpTcoCalculatorView from '@/components/modals/ErpTcoCalculatorView';
import CloudCostCalculatorView from '@/components/modals/CloudCostCalculatorView';
import DiagnosticoWizardView from '@/components/modals/DiagnosticoWizardView';
import OfficeHoursView from '@/components/modals/OfficeHoursView';
import CasoApePlazasView from '@/components/modals/CasoApePlazasView';
import CasoAplazoView from '@/components/modals/CasoAplazoView';
import DoctrinaView from '@/components/modals/DoctrinaView';
import TransparenciaView from '@/components/modals/TransparenciaView';


// Section components
import Hero from '@/components/sections/Hero';
import Comparadores from '@/components/sections/Comparadores';
import Terminal from '@/components/sections/Terminal';
import Doctrina from '@/components/sections/Doctrina';
import Casos from '@/components/sections/Casos';
import Industrias from '@/components/sections/Industrias';
import FabricOS from '@/components/sections/FabricOS';
import Lifecycle from '@/components/sections/Lifecycle';
import Referencias from '@/components/sections/Referencias';
import Transparencia from '@/components/sections/Transparencia';
import Investigacion from '@/components/sections/Investigacion';
import DoctrinaFiltrado from '@/components/sections/DoctrinaFiltrado';
import Admision from '@/components/sections/Admision';
import Footer from '@/components/layout/Footer';
import FounderSection from '@/components/sections/FounderSection';
import PuenteSection from '@/components/sections/PuenteSection';
import DoctrineGenerator from '@/components/sections/DoctrineGenerator';
import ApplyReverse from '@/components/sections/ApplyReverse';
import AuditTrailSection from '@/components/sections/AuditTrailSection';
import AgendaCita from '@/components/sections/AgendaCita';
import ScrollFomoDivider from '@/components/layout/ScrollFomoDivider';

const PAPER_DETAILS: Record<string, { badge: string; outline: string }> = {
  'Por qué fallan los go-live de Oracle Fusion': {
    badge: 'RESEARCH NOTE',
    outline: `Paper 01 — "Por qué fallan los go-live de Oracle Fusion"
═══════════════════════════════════════════════════════════════════

  PAPER 01 — RESEARCH NOTE
  
  POR QUÉ FALLAN LOS GO-LIVE DE ORACLE FUSION
  Análisis de patrones de fracaso en implementaciones LATAM
  
  Páginas: 8-10
  Audiencia: CFOs, CIOs, Directores de Transformación
  
  OUTLINE:
  
  1. INTRODUCCIÓN (1 página)
     · El mito del go-live como hito final
     · Datos de mercado: tasa de fracaso real
  
  2. PATRONES DE FRACASO (3 páginas)
     · Patrón 1: Abandono post go-live
     · Patrón 2: Cierre contable como primera crisis
     · Patrón 3: Usuarios sin adopción real
     · Patrón 4: Integraciones a medio terminar
     · Patrón 5: Reportes manuales paralelos
  
  3. CAUSAS RAÍZ (2 páginas)
     · Modelos de incentivos del proveedor
     · Definición ambigua de "entregado"
     · Falta de tablero ejecutivo de estabilización
     · Ausencia de célula post go-live
  
  4. MODELO ALTERNATIVO (2 páginas)
     · Definición de "primer ciclo crítico"
     · Hitos verificables de estabilización
     · Doctrina contractual FABRIC
  
  5. CONCLUSIÓN Y RECOMENDACIONES (1 página)
     · Cómo evaluar a un proveedor Oracle
     · Cláusulas contractuales a exigir
     · Señales de alerta tempranas
  
  AUTORÍA: Julio Alvarez, Founder FABRIC`
  },
  'IA aplicada a cierre contable en Fusion Cloud': {
    badge: 'TECHNICAL FRAMEWORK',
    outline: `Paper 02 — "IA aplicada a cierre contable en Fusion Cloud"
═══════════════════════════════════════════════════════════════════

  PAPER 02 — TECHNICAL FRAMEWORK
  
  IA APLICADA A CIERRE CONTABLE EN ORACLE FUSION CLOUD
  Framework FABRIC con casos de aplicación
  
  Páginas: 10-12
  Audiencia: CFOs, Controllers, Directores de Sistemas
  
  OUTLINE:
  
  1. CONTEXTO (1 página)
     · El cierre contable como cuello de botella
     · Estado del arte: lo que Oracle nativo ofrece
     · Lo que NO ofrece y crea oportunidad de IA
  
  2. FRAMEWORK FABRIC (4 páginas)
     · Capa 1: Detección de anomalías en cuentas
     · Capa 2: Conciliación automática inteligente
     · Capa 3: Predicción de partidas pendientes
     · Capa 4: Generación automatizada de notas
     · Capa 5: Tablero ejecutivo predictivo
  
  3. ARQUITECTURA TÉCNICA (2 páginas)
     · Componentes
     · Integración con Fusion Cloud
     · Modelo de seguridad
     · Modelo de aislamiento de datos
  
  4. CASOS DE APLICACIÓN (3 páginas)
     · Caso A: Reducción de tiempo de cierre 60%
     · Caso B: Detección de errores pre-cierre
     · Caso C: Generación automática de reportes
  
  5. CONSIDERACIONES (1 página)
     · Cuándo aplica, cuándo no
     · Pre-requisitos técnicos
     · ROI esperado
  
  AUTORÍA: Equipo FABRIC + Julio Alvarez`
  },
  'Modelo de entrega en primer ciclo crítico': {
    badge: 'DOCTRINA OPERATIVA',
    outline: `Paper 03 — "Modelo de entrega en primer ciclo crítico"
═══════════════════════════════════════════════════════════════════

  PAPER 03 — DOCTRINA OPERATIVA
  
  MODELO DE ENTREGA EN PRIMER CICLO CRÍTICO
  La doctrina contractual de FABRIC
  
  Páginas: 6-8
  Audiencia: CFOs, COO, CIOs, área legal de cliente
  
  OUTLINE:
  
  1. PROBLEMA DE LA INDUSTRIA (1 página)
     · Definición ambigua de "entregado"
     · Riesgos contractuales que esto genera
     · Cómo lo aprovechan proveedores irresponsables
  
  2. DEFINICIÓN FABRIC DE ENTREGA (2 páginas)
     · Concepto: primer ciclo crítico
     · Tipos de ciclo crítico (financiero, operativo,
       regulatorio)
     · Hitos verificables de cada tipo
  
  3. CLÁUSULAS CONTRACTUALES MODELO (2 páginas)
     · Definición de alcance hasta primer ciclo
     · Hitos de pago alinhados a estabilización
     · Penalización por atraso del proveedor
     · Tablero ejecutivo de estabilización
     · Acta formal de transición a soporte
  
  4. EJECUCIÓN PRÁCTICA (2 páginas)
     · Cómo se ejecuta la fase STABILIZE
     · Composición de la célula FABRIC
     · Gobierno durante estabilización
     · Documentación obligatoria
  
  5. RESULTADOS ESPERADOS (1 página)
     · Para el cliente
     · Para el proveedor
     · Para la industria
  
  AUTORÍA: Julio Alvarez, Founder FABRIC`
  }
};

export default function Home() {
  // Dot Navigation and Scroll Spy
  const [activeSection, setActiveSection] = useState('inicio');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Gated Research Paper Modal state
  const [activePaper, setActivePaper] = useState<string | null>(null);
  const [gatedName, setGatedName] = useState('');
  const [gatedEmail, setGatedEmail] = useState('');
  const [gatedCompany, setGatedCompany] = useState('');
  const [gatedRole, setGatedRole] = useState('');
  const [gatedError, setGatedError] = useState('');
  const [gatedSuccess, setGatedSuccess] = useState(false);
  const [gatedLoading, setGatedLoading] = useState(false);

  // Overlay Modal state
  const [activeOverlayModal, setActiveOverlayModal] = useState<'erp' | 'cloud' | 'diagnostico' | 'office-hours' | 'ape-plazas' | 'aplazo' | 'doctrina' | 'transparencia' | null>(null);

  // Language translation state (Spanish <-> English)
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const checkLang = () => {
      const match = document.cookie.match(/googtrans=([^;]+)/);
      if (match && match[1].includes('/en')) {
        setCurrentLang('en');
      } else {
        setCurrentLang('es');
      }
    };
    checkLang();
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'es' ? 'en' : 'es';
    const domain = window.location.hostname === 'localhost' ? '' : `; domain=.${window.location.hostname.replace(/^www\./, '')}`;
    
    if (nextLang === 'es') {
      // Clear cookie to restore default page language (Spanish)
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      if (window.location.hostname !== 'localhost') {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domain}`;
      }
    } else {
      // Set to English
      document.cookie = 'googtrans=/es/en; path=/';
      document.cookie = `googtrans=/es/en; path=/; domain=${window.location.hostname}`;
      if (window.location.hostname !== 'localhost') {
        document.cookie = `googtrans=/es/en; path=/${domain}`;
      }
    }
    window.location.reload();
  };

  const sections = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'comparadores', label: 'Comparadores' },
    { id: 'agenda', label: 'Office Hours' },
    { id: 'terminal', label: 'AI Consultant' },
    { id: 'doctrina', label: 'Doctrina' },
    { id: 'generator-idea', label: 'Idea Radical' },
    { id: 'casos', label: 'Casos' },
    { id: 'audit-trail', label: 'Audit Trail' },
    { id: 'industrias', label: 'Industrias' },
    { id: 'fabricos', label: 'FABRIC OS' },
    { id: 'lifecycle', label: 'Lifecycle' },
    { id: 'referencias', label: 'Referencias' },
    { id: 'transparencia', label: 'Transparencia' },
    { id: 'founder', label: 'Founder' },
    { id: 'investigacion', label: 'Investigación' },
    { id: 'doctrina-filtrado', label: 'Filtrado' },
    { id: 'apply-reverse', label: 'Rechazados' },
    { id: 'admision', label: 'Aplicar' }
  ];

  const navSections = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'comparadores', label: 'Comparadores' },
    { id: 'agenda', label: 'Office Hours' },
    { id: 'terminal', label: 'AI Consultant' },
    { id: 'doctrina', label: 'Doctrina' },
    { id: 'generator-idea', label: 'Idea Radical' },
    { id: 'casos', label: 'Casos' },
    { id: 'audit-trail', label: 'Audit Trail' },
    { id: 'fabricos', label: 'Fabric OS' },
    { id: 'referencias', label: 'Referencias' },
    { id: 'transparencia', label: 'Transparencia' },
    { id: 'investigacion', label: 'Investigación' },
    { id: 'apply-reverse', label: 'Rechazados' },
    { id: 'admision', label: 'Aplicar' }
  ];

  const sectionParentMap: Record<string, string> = {
    'inicio': 'inicio',
    'comparadores': 'comparadores',
    'agenda': 'agenda',
    'terminal': 'terminal',
    'doctrina': 'doctrina',
    'generator-idea': 'generator-idea',
    'casos': 'casos',
    'audit-trail': 'audit-trail',
    'industrias': 'audit-trail',
    'fabricos': 'fabricos',
    'lifecycle': 'fabricos',
    'referencias': 'referencias',
    'transparencia': 'transparencia',
    'founder': 'transparencia',
    'investigacion': 'investigacion',
    'doctrina-filtrado': 'investigacion',
    'apply-reverse': 'apply-reverse',
    'admision': 'admision'
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Scroll tracking for dots and progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      // Scrolled state for navbar
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll Spy
      let currentSection = 'inicio';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Paper download submit
  const handleGatedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGatedError('');

    if (!isCorporateEmail(gatedEmail)) {
      setGatedError('Sólo se aceptan correos corporativos.');
      return;
    }

    setGatedLoading(true);
    try {
      const res = await submitEvidenceRequestAction({
        name: gatedName,
        email: gatedEmail,
        company: gatedCompany,
        role: gatedRole,
        docName: activePaper || '',
        type: 'paper',
        ndaAccepted: false
      });

      if (res.success) {
        setGatedSuccess(true);
      } else {
        setGatedError('Error al enviar la solicitud. Intente de nuevo.');
      }
    } catch (err) {
      setGatedError('Ocurrió un error al procesar el envío.');
    } finally {
      setGatedLoading(false);
    }
  };

  // Reset gated state when closed/opened
  useEffect(() => {
    if (!activePaper) {
      setGatedName('');
      setGatedEmail('');
      setGatedCompany('');
      setGatedRole('');
      setGatedError('');
      setGatedSuccess(false);
      setGatedLoading(false);
    }
  }, [activePaper]);

  // Find index of active parent section for progress tracking
  const activeParentId = sectionParentMap[activeSection] || 'inicio';
  const activeIndex = navSections.findIndex(s => s.id === activeParentId);
  const activePercent = navSections.length > 1 ? (activeIndex / (navSections.length - 1)) * 100 : 0;

  return (
    <>
      {/* Right Side Floating Dot Navigation */}
      <div 
        className={`hidden lg:flex dot-nav-container transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'opacity-100 translate-x-0 pointer-events-auto' 
            : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div className="dot-nav-wrapper">
          {/* Track Line */}
          <div className="dot-nav-track" />
          
          {/* Active Progress Filler */}
          <div 
            className="dot-nav-progress"
            style={{ height: `calc((100% - 56px) * ${activePercent / 100})` }}
          />

          {/* Dots List */}
          <ul className="dot-nav-list">
            {navSections.map((section) => {
              const isCurrent = activeParentId === section.id;
              return (
                <li
                  key={section.id}
                  className={`dot-nav-item ${isCurrent ? 'active' : ''}`}
                >
                  <a
                    href={`#${section.id}`}
                    className="dot-nav-link"
                    title={section.label}
                  >
                    {/* Text Label */}
                    <span className="dot-nav-label">
                      {section.label.toUpperCase()}
                    </span>
                    
                    {/* Dot Element */}
                    <div className="dot-nav-dot" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur transition-all duration-300 px-4 md:px-12 flex items-center ${isScrolled ? 'h-12 md:h-14 border-b border-[rgba(201,169,110,0.08)] bg-black/80' : 'h-16 md:h-20 border-b border-[rgba(201,169,110,0.15)]'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 relative w-full h-full">
          
          <div className="flex items-center gap-12 md:gap-16">
            <Link href="/" className="nav-logo-link">
              <img 
                src="/img/logo.png" 
                alt="FabricSoft Logo" 
                className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-[24px] md:h-[30px]' : 'h-[36px] md:h-[44px]'}`}
              />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 transition-all duration-300 shrink-0">
            {/* HUD Capacidad Navbar */}
            <div className="hidden md:flex items-center gap-2 font-mono text-[9px] text-zinc-500 border border-zinc-900 bg-zinc-950/60 py-1.5 px-3 rounded select-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
              <span className="tracking-wider">CAPACIDAD: <span className="text-accent font-bold">1 SLOT LIBRE</span> PARA 2026</span>
            </div>

            <a href="#admision" className="btn-outline-accent !py-1.5 !px-2.5 sm:!py-2 sm:!px-4 text-[10px] sm:text-[11px] whitespace-nowrap">
              Solicitar Admisión
            </a>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="notranslate border border-zinc-800 hover:border-accent bg-zinc-950/40 text-zinc-400 hover:text-accent font-mono text-[10px] py-1.5 px-2 sm:px-3 rounded transition-all duration-300 cursor-pointer flex items-center gap-1 sm:gap-1.5 shrink-0"
              title={currentLang === 'es' ? 'Traducir al Inglés' : 'Translate to Spanish'}
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline-block">{currentLang === 'es' ? 'EN' : 'ES'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Page Sections */}
      <Hero setActiveOverlayModal={setActiveOverlayModal} />
      <PuenteSection />
      
      <ScrollFomoDivider label="COMPARAR COSTOS: AWS/AZURE APLICAN MULTIPLICADORES OCULTOS HASTA 10X DEBAJO" targetId="comparadores" />
      <Comparadores setActiveOverlayModal={setActiveOverlayModal} />
      
      <AgendaCita setActiveOverlayModal={setActiveOverlayModal} />
      
      <ScrollFomoDivider label="CONSULTORÍA DE RIESGO CON IA: SIMULA TUS INTEGRACIONES EN TIEMPO REAL DEBAJO" targetId="terminal" />
      <Terminal />
      
      <Doctrina setActiveOverlayModal={setActiveOverlayModal} />
      <DoctrineGenerator />
      
      <ScrollFomoDivider label="PRUEBAS DE INGENIERÍA: ACCEDE AL EXPEDIENTE DE AUDITORÍA CONTRACTUAL DEBAJO" targetId="casos" />
      <Casos setActiveOverlayModal={setActiveOverlayModal} />
      <AuditTrailSection />
      
      <Industrias />
      <FabricOS />
      <Lifecycle />
      <Referencias setActiveOverlayModal={setActiveOverlayModal} />
      <Transparencia setActiveOverlayModal={setActiveOverlayModal} />
      <FounderSection />
      <Investigacion setActivePaper={setActivePaper} />
      <DoctrinaFiltrado />
      
      <ScrollFomoDivider label="REGISTRO DE RECHAZADOS: MIRA POR QUÉ RECHAZAMOS EVALUACIONES DE USD 80M DE REVENUE DEBAJO" targetId="apply-reverse" />
      <ApplyReverse />
      
      <ScrollFomoDivider label="RADAR DE ADMISIÓN: SÓLO 1 SLOT DISPONIBLE PARA Q3. REGISTRA TU INICIATIVA DEBAJO" targetId="admision" />
      <Admision />

      {/* Footer */}
      <Footer />

      {/* Gated Research Paper Modal */}
      {activePaper && (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-accent p-6 md:p-8 max-w-3xl w-full relative space-y-6 font-mono text-xs text-zinc-400 shadow-[0_0_35px_rgba(201,169,110,0.18)]">
            
            {/* Esquinas decorativas de la consola */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/40" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-accent/40" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent/40" />

            <button 
              onClick={() => setActivePaper(null)} 
              className="absolute top-4 right-4 text-zinc-500 hover:text-accent cursor-pointer bg-black border border-zinc-900 hover:border-accent px-2.5 py-1 z-10 transition-colors font-mono text-[9px] uppercase tracking-wider"
            >
              [CERRAR X]
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
              {/* Left Column: Outline Details */}
              <div className="space-y-3">
                <span className="badge-premium mb-1 inline-block text-[10px]">
                  {PAPER_DETAILS[activePaper]?.badge || 'WHITE PAPER'}
                </span>
                <h3 className="text-base font-serif text-white font-light leading-tight">
                  {activePaper}
                </h3>
                {PAPER_DETAILS[activePaper] ? (
                  <pre className="bg-black border border-zinc-900 p-4 rounded overflow-y-auto max-h-[320px] font-mono text-[9px] text-zinc-400 leading-relaxed whitespace-pre-wrap select-text custom-scrollbar">
                    {PAPER_DETAILS[activePaper].outline}
                  </pre>
                ) : (
                  <div className="bg-black border border-zinc-900 p-4 rounded text-zinc-600 text-center py-12">
                    Cargando estructura...
                  </div>
                )}
              </div>

              {/* Right Column: Download Form */}
              <div className="space-y-6 md:pt-8">
                <div className="text-center space-y-2">
                  <FileText className="w-12 h-12 text-accent mx-auto animate-pulse" />
                  <h4 className="text-sm font-serif text-zinc-300 font-light">Solicitud de Acceso Gated</h4>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    Para acceder a la versión completa del paper en formato PDF de alta resolución, valide su credencial profesional.
                  </p>
                </div>

                {gatedSuccess ? (
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-center text-emerald-500 rounded font-sans text-xs">
                    ✓ Solicitud procesada. Verifique su bandeja de entrada corporativa.
                  </div>
                ) : (
                  <form onSubmit={handleGatedSubmit} className="space-y-3">
                    <div>
                      <label className="text-zinc-500 block mb-1 text-[10px] uppercase">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={gatedName}
                        onChange={(e) => setGatedName(e.target.value)}
                        placeholder="Ej. Roberto Martínez"
                        className="w-full bg-black border border-zinc-800 text-white p-2.5 outline-none focus:border-accent text-xs font-mono"
                      />
                    </div>
                    
                    <div>
                      <label className="text-zinc-500 block mb-1 text-[10px] uppercase">Empresa *</label>
                      <input
                        type="text"
                        required
                        value={gatedCompany}
                        onChange={(e) => setGatedCompany(e.target.value)}
                        placeholder="Ej. Banco del Norte S.A."
                        className="w-full bg-black border border-zinc-800 text-white p-2.5 outline-none focus:border-accent text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-500 block mb-1 text-[10px] uppercase">Cargo / Puesto *</label>
                      <input
                        type="text"
                        required
                        value={gatedRole}
                        onChange={(e) => setGatedRole(e.target.value)}
                        placeholder="Ej. CIO / Director de Finanzas"
                        className="w-full bg-black border border-zinc-800 text-white p-2.5 outline-none focus:border-accent text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-500 block mb-1 text-[10px] uppercase">Correo Corporativo *</label>
                      <input
                        type="email"
                        required
                        value={gatedEmail}
                        onChange={(e) => setGatedEmail(e.target.value)}
                        placeholder="nombre@empresa.com"
                        className="w-full bg-black border border-zinc-800 text-white p-2.5 outline-none focus:border-accent text-xs font-mono"
                      />
                      {gatedError && (
                        <span className="text-red-500 text-[10px] block mt-1">{gatedError}</span>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={gatedLoading}
                      className="btn-primary-accent w-full justify-center text-xs py-2.5 font-bold uppercase mt-2"
                    >
                      {gatedLoading ? 'Procesando...' : 'Solicitar Enlace de Descarga'}
                    </button>
                  </form>
                )}

                <p className="text-[9px] text-zinc-600 text-center leading-normal">
                  Los FSO (Objetos de Solución) y metodologías técnicas son propiedad de FABRIC. Se requiere un correo corporativo verificable.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Overlay Modal Widget */}
      {activeOverlayModal && (
        <div className="fixed inset-0 z-[1500] bg-black/90 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto pt-24 pb-12">
          <div className="bg-zinc-950 border border-accent p-6 md:p-10 max-w-4xl w-full relative">
            <button 
              type="button"
              onClick={() => setActiveOverlayModal(null)} 
              className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer font-mono text-[11px] border border-zinc-800 px-2.5 py-1 bg-black"
            >
              [CERRAR X]
            </button>
            
            <div className="mt-4">
              {activeOverlayModal === 'erp' && <ErpTcoCalculatorView />}
              {activeOverlayModal === 'cloud' && <CloudCostCalculatorView />}
              {activeOverlayModal === 'diagnostico' && (
                <DiagnosticoWizardView onBookingLinkClick={() => setActiveOverlayModal('office-hours')} />
              )}
              {activeOverlayModal === 'office-hours' && <OfficeHoursView />}
              {activeOverlayModal === 'ape-plazas' && <CasoApePlazasView />}
              {activeOverlayModal === 'aplazo' && <CasoAplazoView />}
              {activeOverlayModal === 'doctrina' && <DoctrinaView />}
              {activeOverlayModal === 'transparencia' && <TransparenciaView />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
