"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, Printer, RefreshCw, FileText, CheckCircle2, ChevronRight, AlertOctagon, HelpCircle } from 'lucide-react';
import { submitDoctrineLeadAction } from '@/app/actions/leads';

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multi';
  options: string[];
}

function DoctrineGeneratorContent() {
  const [step, setStep] = useState<number>(1); // 1 = Bienvenida, 2 = Preguntas (1-6), 3 = Captura, 4 = Reporte
  const [qIndex, setQIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    projectType: '',
    industry: '',
    revenue: '',
    timeline: '',
    concerns: [],
    roleInProject: ''
  });

  // Lead capture state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadRole, setLeadRole] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  const questions: Question[] = [
    {
      id: 'projectType',
      text: '¿Qué tipo de proyecto Oracle estás considerando?',
      type: 'single',
      options: [
        'Implementación nueva de Fusion Cloud',
        'Migración desde EBS / JDE / PeopleSoft',
        'Migración desde SAP u otro ERP',
        'Optimización de Fusion existente',
        'DRP / Continuidad operativa',
        'No definido aún'
      ]
    },
    {
      id: 'industry',
      text: '¿En qué industria opera tu empresa?',
      type: 'single',
      options: [
        'Servicios financieros / Fintech',
        'Inmobiliario / Centros comerciales',
        'Logística / Distribución',
        'Manufactura',
        'Retail',
        'Energía / Utilities',
        'Otro'
      ]
    },
    {
      id: 'revenue',
      text: '¿Cuál es el revenue anual aproximado?',
      type: 'single',
      options: [
        '< USD 50M',
        'USD 50M - 250M',
        'USD 250M - 1B',
        '> USD 1B'
      ]
    },
    {
      id: 'timeline',
      text: '¿Cuándo planeas iniciar el proyecto?',
      type: 'single',
      options: [
        'Próximos 3 meses',
        '3-6 meses',
        '6-12 meses',
        'Sin plazo definido'
      ]
    },
    {
      id: 'concerns',
      text: '¿Qué te preocupa más? (Selecciona todas las que apliquen)',
      type: 'multi',
      options: [
        'Costos que se disparan',
        'Plazos que se eternizan',
        'Calidad de consultores',
        'Soporte post go-live',
        'Documentación y transferencia',
        'Adopción de usuarios',
        'Continuidad operativa'
      ]
    },
    {
      id: 'roleInProject',
      text: 'Tu rol en el proyecto:',
      type: 'single',
      options: [
        'CFO',
        'CIO / CTO',
        'Director de Transformación',
        'CEO',
        'Otro'
      ]
    }
  ];

  const handleNextQuestion = (value: string | string[]) => {
    const currentQ = questions[qIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }));

    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setStep(3); // Go to lead capture form
    }
  };

  const handleMultiSubmit = (selectedOptions: string[]) => {
    if (selectedOptions.length === 0) {
      setErrorMsg('Selecciona al menos una preocupación para continuar.');
      return;
    }
    setErrorMsg('');
    handleNextQuestion(selectedOptions);
  };

  const handleBackQuestion = () => {
    if (qIndex > 0) {
      setQIndex(qIndex - 1);
    } else {
      setStep(1); // Go back to welcome screen
    }
  };

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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCorporateEmail(leadEmail)) {
      setErrorMsg('Sólo se aceptan correos corporativos.');
      return;
    }

    setLoading(true);

    try {
      const res = await submitDoctrineLeadAction({
        name: leadName,
        email: leadEmail,
        company: leadCompany,
        role: leadRole,
        answers: {
          projectType: String(answers.projectType || ''),
          industry: String(answers.industry || ''),
          revenue: String(answers.revenue || ''),
          timeline: String(answers.timeline || ''),
          concerns: (answers.concerns as string[]) || [],
          roleInProject: String(answers.roleInProject || '')
        }
      });

      if (res.success) {
        setLeadId(res.leadId || 'DL-' + Math.floor(1000 + Math.random() * 9000));
        setStep(4); // Go to report screen
      } else {
        setErrorMsg('Error al registrar sus datos. Intente de nuevo.');
      }
    } catch (err) {
      setErrorMsg('Ocurrió un error al procesar el envío.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setQIndex(0);
    setAnswers({
      projectType: '',
      industry: '',
      revenue: '',
      timeline: '',
      concerns: [],
      roleInProject: ''
    });
    setLeadName('');
    setLeadEmail('');
    setLeadCompany('');
    setLeadRole('');
    setLeadId(null);
    setErrorMsg('');
  };

  // Generate recommended clauses based on answers
  const generateClauses = () => {
    const clausesList = [];

    // 1. Project Type Clause
    const pt = answers.projectType;
    if (pt === 'Implementación nueva de Fusion Cloud') {
      clausesList.push({
        title: 'CLÁUSULA 1.1 - ALCANCE GREENFIELD Y DECLARACIÓN DE SUFICIENCIA OPERATIVA',
        text: 'El Proveedor declara expresamente que ha revisado la totalidad de procesos contables y operativos del Cliente y que la arquitectura Greenfield propuesta es técnica y funcionalmente suficiente para el correcto go-live. No se admitirán solicitudes de cambio (Change Orders) por configuraciones estándar u omisiones que debieron preverse en la fase de diseño.',
        why: 'En proyectos Greenfield, es común que los consultores soliciten órdenes de cambio a mitad de camino argumentando "procesos no documentados". Esta cláusula los obliga a responsabilizarse de su diagnóstico preliminar.'
      });
    } else if (pt === 'Migración desde EBS / JDE / PeopleSoft' || pt === 'Migración desde SAP u otro ERP') {
      clausesList.push({
        title: 'CLÁUSULA 1.2 - RECONCILIACIÓN HISTÓRICA E INTEGRIDAD DE SALDOS DE APERTURA',
        text: 'El Proveedor es responsable único de verificar el mapeo de balanzas contables antiguas al catálogo de cuentas de Fusion Cloud. El hito se considerará liberado sólo cuando la balanza de comprobación generada en Fusion cuadre al centavo con el cierre formal auditado del antiguo sistema legacy.',
        why: 'Las migraciones de ERP suelen fallar en el traspaso de saldos históricos, dejando al equipo de contabilidad ciego durante el primer mes. Esta cláusula obliga a certificar el cuadre de datos históricos antes de apagar el sistema anterior.'
      });
    } else if (pt === 'Optimización de Fusion existente') {
      clausesList.push({
        title: 'CLÁUSULA 1.3 - AUDITORÍA DE CONFIGURACIÓN Y GARANTÍA DE SANEAMIENTO RECURRENTE',
        text: 'El Proveedor ejecutará un diagnóstico exhaustivo de incidentes activos y se compromete a remediar los fallos de configuración recurrentes descritos en el Anexo de Errores. Todo ticket remanente no solucionado en el plazo acordado devengará una penalización equivalente al 5% de la póliza mensual.',
        why: 'Al estabilizar sistemas inestables, las consultoras suelen culpar al integrador anterior para justificar su inactividad. Esto garantiza que asuman la responsabilidad del saneamiento técnico contratado.'
      });
    } else if (pt === 'DRP / Continuidad operativa') {
      clausesList.push({
        title: 'CLÁUSULA 1.4 - GARANTÍA DE RPO/RTO EN CONTINGENCIA CRÍTICA Y PRUEBA ANUAL',
        text: 'El Proveedor certifica que los scripts y la configuración de recuperación ante desastres (DRP) en OCI garantizan un RTO (Recovery Time Objective) menor a 4 horas y un RPO (Recovery Point Objective) menor a 1 hora. Se realizarán pruebas de simulacro de caída semestrales con la presencia de auditores del Cliente.',
        why: 'Las soluciones de continuidad operativa a menudo se contratan de forma nominal sin probarse en la realidad. El simulacro periódico obligatorio garantiza que el DRP responda en una crisis operativa real.'
      });
    } else {
      clausesList.push({
        title: 'CLÁUSULA 1.5 - GOBERNANZA TÉCNICA DE ACCESOS Y AUDITORÍA DE ROLES ERP',
        text: 'El Proveedor configurará políticas estrictas de segregación de funciones (SoD) y habilitará los logs de auditoría contable en el ERP. El Cliente retendrá el 10% del hito de seguridad hasta que una auditoría externa valide la ausencia de conflictos de acceso críticos en roles contables.',
        why: 'Previene fraudes internos y asegura la seguridad y cumplimiento regulatorio del sistema contable para auditorías externas de fin de año.'
      });
    }

    // 2. Industry Clause
    const ind = answers.industry;
    if (ind === 'Servicios financieros / Fintech') {
      clausesList.push({
        title: 'CLÁUSULA 2.1 - CONCILIACIÓN DE PASARELAS Y TRAZABILIDAD REGULATORIA (PLD)',
        text: 'El Proveedor integrará de forma nativa las pasarelas de pago del Cliente al Libro de Caja y Bancos del ERP, asegurando que cada transacción incluya los identificadores únicos (UUID/Hash) de la operación original. Asimismo, la configuración debe admitir la extracción automatizada de reportes regulatorios requeridos por la comisión nacional supervisora.',
        why: 'En el sector financiero, el volumen masivo exige conciliaciones automáticas e integridad absoluta de logs de transacción para auditorías gubernamentales y prevención de lavado de dinero.'
      });
    } else if (ind === 'Inmobiliario / Centros comerciales') {
      clausesList.push({
        title: 'CLÁUSULA 2.2 - GESTIÓN Y TIMBRADO AUTOMÁTICO DE ARRENDAMIENTOS CFDI',
        text: 'El sistema configurado ejecutará el cálculo de rentas variables y mantenimiento de manera masiva y timbrará directamente ante la autoridad fiscal (SAT) los comprobantes de arrendamiento en CFDI 4.0 sin recurrir a software intermedio o reprocesos manuales por parte del equipo de cuentas por cobrar.',
        why: 'Evita la parálisis del flujo de caja causada por la facturación manual o desincronizada de miles de inquilinos comerciales.'
      });
    } else if (ind === 'Logística / Distribución') {
      clausesList.push({
        title: 'CLÁUSULA 2.3 - TRAZABILIDAD DE COSTEO DE INVENTARIOS Y FLETES (LANDED COST)',
        text: 'La configuración del módulo de cadena de suministro (SCM) automatizará el cálculo de Landed Cost (Costo puesto en almacén), prorrateando aranceles, fletes y seguros directamente sobre el valor neto de los artículos de inventario. Las variaciones en costos de tránsito se conciliarán de forma automática con el módulo de compras.',
        why: 'El costeo incorrecto en distribución destruye el margen de operación. Esta cláusula exige la automatización del costeo de fletes reales en vez de prorrateos manuales contables.'
      });
    } else if (ind === 'Manufactura') {
      clausesList.push({
        title: 'CLÁUSULA 2.4 - INTEGRACIÓN DE COSTEO ESTÁNDAR Y DESVIACIONES DE PRODUCCIÓN',
        text: 'La configuración contable registrará las desviaciones de material y mano de obra en tiempo real al cierre de cada orden de producción. Toda desviación mayor al 2% entre el costo estimado y el costo real reportará una alerta contable automatizada.',
        why: 'El control preciso de costos de producción previene pérdidas financieras indetectables hasta el cierre de balance trimestral.'
      });
    } else if (ind === 'Retail') {
      clausesList.push({
        title: 'CLÁUSULA 2.5 - RECONCILIACIÓN DIARIA DE PUNTOS DE VENTA (POS)',
        text: 'El Proveedor desarrollará una interfaz de integración diaria que cuadre los cortes de caja de las tiendas físicas y e-commerce con los depósitos bancarios reales y las salidas de inventario en el ERP. El desfase máximo permitido para esta reconciliación será de 24 horas.',
        why: 'El retail maneja transacciones de alto volumen y flujo constante; no reconciliar diariamente genera fugas masivas de inventario y efectivo.'
      });
    } else if (ind === 'Energía / Utilities') {
      clausesList.push({
        title: 'CLÁUSULA 2.6 - COSTEO DE ACTIVOS DE INFRAESTRUCTURA DE LARGA DURACIÓN',
        text: 'El módulo de Activos Fijos del ERP calculará las depreciaciones y capitalización de proyectos de construcción de red basándose en hitos de avance físico. La depreciación fiscal y contable se mantendrá separada y automatizada según la legislación local aplicable.',
        why: 'Garantiza el correcto diferimiento de costos de infraestructura masiva y evita multas impositivas severas.'
      });
    } else {
      clausesList.push({
        title: 'CLÁUSULA 2.7 - TRANSPARENCIA EN PROVEEDURÍA LOCAL',
        text: 'Toda integración con proveedores locales de facturación o nómina se ejecutará mediante conexiones seguras APIs de doble vía, con reintentos automáticos y bitácora de errores visible para los analistas de TI del Cliente.',
        why: 'Evita fallos de conectividad con proveedores locales que interrumpan el timbrado de facturas u operaciones de pago a nóminas.'
      });
    }

    // 3. Revenue Clause
    const rev = answers.revenue;
    if (rev === '< USD 50M') {
      clausesList.push({
        title: 'CLÁUSULA 3.1 - EFICIENCIA OPERATIVA Y BAJO COSTO DE MANTENIMIENTO',
        text: 'El diseño de la solución priorizará funciones nativas del ERP (Out-of-the-box). Cualquier desarrollo personalizado (Customization) requerirá la aprobación firmada del CFO y una justificación de Retorno de Inversión (ROI) mayor al costo del desarrollo a 12 meses.',
        why: 'Evita que empresas medianas adquieran un sistema sobre-diseñado y costoso de mantener en futuras actualizaciones obligatorias.'
      });
    } else if (rev === 'USD 50M - 250M') {
      clausesList.push({
        title: 'CLÁUSULA 3.2 - ESCALABILIDAD DE PROCESOS Y SEGREGACIÓN DE ROLES (WORKFLOWS)',
        text: 'El diseño jerárquico del ERP contemplará al menos 3 niveles de autorización de compras y gastos, y el workflow de aprobación se integrará con el directorio activo de la empresa de forma automatizada.',
        why: 'En esta escala de crecimiento rápido, el control interno manual es el principal generador de fraudes e ineficiencia.'
      });
    } else if (rev === 'USD 250M - 1B') {
      clausesList.push({
        title: 'CLÁUSULA 3.3 - MULTI-PAÍS, MULTI-MONEDA Y CONSOLIDACIÓN FINANCIERA AUTOMÁTICA',
        text: 'La configuración del Ledger principal y los ledgers secundarios automatizará la conversión de monedas extranjeras y la eliminación de transacciones intercompañía al cierre contable de cada mes, reduciendo el proceso a un único clic de ejecución.',
        why: 'Ahorra cientos de horas de trabajo en hojas de cálculo contables al consolidar subsidiarias globales.'
      });
    } else {
      clausesList.push({
        title: 'CLÁUSULA 3.4 - GOBERNANZA DE DATOS MAESTROS Y INTEGRACIÓN ENTERPRISE (SOX)',
        text: 'Toda creación o modificación de maestros (Proveedores, Clientes, Catálogo de Cuentas) pasará por un flujo de aprobación de Gobierno de Datos. La bitácora de cambios mantendrá trazabilidad de usuario, fecha e IP para cumplir con los estándares de control Sarbanes-Oxley (SOX).',
        why: 'Es de vital importancia para corporativos multinacionales expuestos a auditorías estrictas y controles financieros de mercado público.'
      });
    }

    // 4. Concern Specific Clauses (based on selected concerns)
    const concerns = (answers.concerns as string[]) || [];

    if (concerns.includes('Costos que se disparan')) {
      clausesList.push({
        title: 'CLÁUSULA C1 - PROHIBICIÓN DE CHANGE ORDERS POR OMISIONES TÉCNICAS',
        text: 'El Proveedor asume el compromiso Fixed-Price. No se admitirán cargos adicionales por integraciones, cargas de datos, o parametrizaciones necesarias para la operación que el Proveedor debió diagnosticar e identificar en su propuesta inicial de servicios.',
        why: 'Bloquea la práctica común de consultoras que ofertan bajo y luego elevan el costo un 50% vía solicitudes de cambio obligatorias.'
      });
    }
    if (concerns.includes('Plazos que se eternizan')) {
      clausesList.push({
        title: 'CLÁUSULA C2 - PENALIZACIÓN DIARIA DE HITOS CRÍTICOS Y DERECHO DE RETENCIÓN',
        text: 'Por cada día de retraso en la entrega de las fases definidas en el cronograma, el Proveedor pagará una penalidad equivalente al 1% de la facturación mensual del proyecto. El Cliente tendrá derecho a retener los pagos vigentes hasta la subsanación total del retraso.',
        why: 'Alinea los incentivos de la consultora con la velocidad de ejecución y protege el flujo financiero de la empresa.'
      });
    }
    if (concerns.includes('Calidad de consultores')) {
      clausesList.push({
        title: 'CLÁUSULA C3 - CERTIFICACIÓN CONTRACTUAL INDIVIDUAL Y DERECHO DE VETO DE PERSONAL',
        text: 'El Proveedor adjuntará al contrato el CV firmado y la hoja de certificaciones activas de Oracle de cada consultor asignado. El Cliente tendrá la facultad de evaluar al personal mediante entrevista técnica y exigir su reemplazo inmediato, sin costo adicional, en caso de detectar falta de aptitud.',
        why: 'Evita la práctica del "bait-and-switch" donde la consultora presenta ingenieros senior para ganar el proyecto y luego asigna perfiles junior para la ejecución diaria.'
      });
    }
    if (concerns.includes('Soporte post go-live')) {
      clausesList.push({
        title: 'CLÁUSULA C4 - SOPORTE HIPERCARE Y ASISTENCIA ACTIVA EN SITIO EN EL PRIMER CIERRE',
        text: 'Durante los primeros 30 días posteriores al go-live (fase Hipercare), el Proveedor mantendrá en sitio a una célula integrada por ingenieros senior. Los pagos de cierre de proyecto no se liberarán hasta que se ejecute el primer cierre contable mensual en un máximo de 5 días hábiles.',
        why: 'Asegura que el proveedor permanezca al lado del cliente durante la etapa más difícil del go-live: el primer cierre de mes contable real.'
      });
    }
    if (concerns.includes('Documentación y transferencia')) {
      clausesList.push({
        title: 'CLÁUSULA C5 - ENTREGA DE RUNBOOKS Y TRANSFERENCIA DE AUTONOMÍA AL EQUIPO INTERNO',
        text: 'El Proveedor entregará los Runbooks (manuales de configuración detallados) y bitácoras de integraciones actualizadas. Al concluir la transición, el equipo de TI del Cliente debe ser capaz de dar soporte básico y crear nuevos reportes y flujos de manera autónoma.',
        why: 'Previene la dependencia forzada de pólizas de soporte infinitas para realizar cambios sencillos o mantenimiento preventivo.'
      });
    }
    if (concerns.includes('Adopción de usuarios')) {
      clausesList.push({
        title: 'CLÁUSULA C6 - CONTROL DE RECHAZO A REPORTES MANUALES PARALELOS',
        text: 'El Proveedor se compromete a configurar y capacitar en el uso de los tableros del ERP de tal forma que se elimine el uso de hojas de cálculo externas para tareas de conciliación contable. Si un proceso requiere el uso de hojas de cálculo por fallas en la configuración, el hito no se considerará aceptado.',
        why: 'Si los usuarios clave terminan haciendo cierres en Excel porque el ERP es confuso o inestable, el proyecto ha fracasado en la práctica.'
      });
    }
    if (concerns.includes('Continuidad operativa')) {
      clausesList.push({
        title: 'CLÁUSULA C7 - PENALIDAD POR INTERRUPCIÓN OPERATIVA EN AMBIENTE PRODUCTIVO',
        text: 'Cualquier falla de configuración o despliegue en ambiente productivo imputable al Proveedor que resulte en la indisponibilidad de la plataforma por más de 2 horas continuas, devengará una penalización directa a favor del Cliente equivalente a USD $10,000 por hora.',
        why: 'Protege la facturación y la continuidad del negocio ante fallas críticas de infraestructura o despliegue de parches incorrectos.'
      });
    }

    // Ensure we have at least 8 clauses, if not add defaults
    if (clausesList.length < 8) {
      clausesList.push({
        title: 'CLÁUSULA C8 - AUDITORÍA MENSUAL DE CÓDIGO PERSONALIZADO (EXTENSIONES)',
        text: 'Toda extensión de código de bases de datos o integraciones personalizadas desarrolladas para Fusion Cloud pasará por una revisión de seguridad y latencia en ambientes sandbox independientes antes del despliegue en producción.',
        why: 'Evita la degradación del rendimiento de base de datos en la nube y bloqueos por código mal estructurado.'
      });
      clausesList.push({
        title: 'CLÁUSULA C9 - SEGUROS POR RESPONSABILIDAD CIVIL CONTRACTUAL',
        text: 'El Proveedor mantendrá activa durante el proyecto una póliza de responsabilidad civil profesional con cobertura mínima equivalente al 50% del valor total de la orden de servicios contratada.',
        why: 'Garantiza el respaldo financiero del integrador en caso de daños accidentales a la base de datos o interrupciones de facturación.'
      });
    }

    return clausesList;
  };

  const handlePrint = () => {
    window.print();
  };

  // State management for multi-select question (P5)
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern) 
        : [...prev, concern]
    );
  };

  const currentQuestionObj = questions[qIndex];

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4 select-text font-mono text-xs">
      
      {/* Hide on Print - Navigation */}
      <div className="max-w-6xl mx-auto space-y-8 no-print">
        
        {/* Navigation back buttons */}
        <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-mono text-xs transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">/doctrina/generator</span>
        </div>

        {/* Title Block */}
        {step !== 4 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge-premium">DOCTRINE GENERATOR</span>
              <span className="text-[10px] text-accent uppercase font-bold tracking-wider">V1.0 PROTOCOLO DE CONTRATO</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-white font-light">
              Generador de Cláusulas Contractuales Oracle
            </h1>
            <p className="text-zinc-400 font-sans text-sm max-w-3xl leading-relaxed">
              Evalúa y blinda tus contratos con integradores externos utilizando las cláusulas críticas de ingeniería de la doctrina de FABRIC.
            </p>
          </div>
        )}

        {/* Layout steps grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Wizard Area */}
          <div className="lg:col-span-8">
            
            {/* STEP 1: WELCOME SCREEN */}
            {step === 1 && (
              <div className="card-premium p-6 md:p-8 space-y-6 relative overflow-hidden bg-zinc-950/20 border border-zinc-900 rounded">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/40" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-serif text-white font-light border-b border-zinc-900 pb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent animate-pulse" />
                    Blindaje Legal y Técnico de tu ERP
                  </h3>
                  <p className="text-zinc-400 font-sans text-xs leading-relaxed max-w-2xl">
                    Las cláusulas que tu próximo contrato Oracle debería incluir. Generadas por FABRIC, basadas en nuestra doctrina pública de ingeniería crítica.
                  </p>
                  
                  <div className="p-4 bg-zinc-950 border border-zinc-900 rounded space-y-2">
                    <span className="text-accent font-bold uppercase tracking-wider block text-[10px]">DETALLES DE LA HERRAMIENTA:</span>
                    <ul className="space-y-1.5 text-zinc-500 font-sans">
                      <li className="flex items-center gap-2">
                        <span className="text-accent font-mono">•</span>
                        <span>Cuestionario de 6 preguntas estratégicas.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent font-mono">•</span>
                        <span>Genera de 8 a 12 cláusulas contractuales específicas.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent font-mono">•</span>
                        <span>Documento imprimible o descargable en PDF.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500">TIEMPO ESTIMADO: 2 MINUTOS</span>
                    <button 
                      onClick={() => setStep(2)}
                      className="btn-primary-accent py-2.5 px-6 text-xs uppercase"
                    >
                      Comenzar Evaluación <ArrowRight className="w-4 h-4 ml-1.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: QUESTIONS WIZARD */}
            {step === 2 && (
              <div className="card-premium p-6 md:p-8 bg-zinc-950/20 border border-zinc-900 rounded relative space-y-6">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
                
                {/* Header indicators */}
                <div className="flex justify-between items-center text-[10px] text-zinc-500">
                  <span className="uppercase tracking-wider">PREGUNTA {qIndex + 1} DE {questions.length}</span>
                  <span className="text-accent">{questions[qIndex].type === 'multi' ? 'SELECCIÓN MÚLTIPLE' : 'SELECCIÓN ÚNICA'}</span>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-zinc-900 w-full rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Question and choices */}
                <div className="space-y-4">
                  <h3 className="text-base font-serif text-white font-light leading-snug">
                    {currentQuestionObj.text}
                  </h3>

                  {currentQuestionObj.type === 'single' ? (
                    <div className="space-y-2">
                      {currentQuestionObj.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleNextQuestion(option)}
                          className="w-full text-left bg-black border border-zinc-800 hover:border-accent p-3 text-zinc-400 hover:text-white rounded transition-all flex items-center justify-between group cursor-pointer font-sans"
                        >
                          <span>{option}</span>
                          <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-accent shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Multi-select logic */
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentQuestionObj.options.map((option, idx) => {
                          const isSelected = selectedConcerns.includes(option);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleConcern(option)}
                              className={`text-left p-3 rounded transition-all border flex items-center justify-between group cursor-pointer font-sans ${
                                isSelected 
                                  ? 'bg-accent/15 border-accent text-white font-semibold' 
                                  : 'bg-black border-zinc-800 text-zinc-400 hover:border-accent hover:text-white'
                              }`}
                            >
                              <span>{option}</span>
                              <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center shrink-0 ml-2 ${isSelected ? 'border-accent bg-accent text-black' : 'border-zinc-700 bg-zinc-950'}`}>
                                {isSelected && <span className="text-[9px] font-bold">✓</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {errorMsg && (
                        <p className="text-red-500 text-[10px] py-1">* {errorMsg}</p>
                      )}

                      <button
                        type="button"
                        onClick={() => handleMultiSubmit(selectedConcerns)}
                        className="btn-primary-accent w-full justify-center py-2.5 text-xs uppercase"
                      >
                        Siguiente Pregunta <ArrowRight className="w-4 h-4 ml-1.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-900 text-[10px]">
                  <button 
                    onClick={handleBackQuestion}
                    className="text-zinc-500 hover:text-white flex items-center gap-1 cursor-pointer font-bold uppercase"
                  >
                    ← Regresar
                  </button>
                  <button 
                    onClick={handleReset}
                    className="text-zinc-600 hover:text-zinc-400 cursor-pointer font-bold uppercase"
                  >
                    [Reiniciar]
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LEAD CAPTURE FORM */}
            {step === 3 && (
              <div className="card-premium p-6 md:p-8 bg-zinc-950/20 border border-zinc-900 rounded relative space-y-6">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
                
                <div>
                  <span className="text-accent uppercase tracking-widest text-[9px] block">PASO FINAL: REGISTRO DE LEAD</span>
                  <h3 className="text-xl font-serif text-white font-light">Para descargar tu PDF personalizado</h3>
                  <p className="text-zinc-400 font-sans text-xs mt-1 leading-relaxed">
                    Ingrese los datos de su corporativo para procesar la emisión formal y la firma de los términos preliminares del dictamen técnico.
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px]">NOMBRE COMPLETO *</label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Ej. Ing. Juan Pérez"
                        className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px]">CORREO CORPORATIVO *</label>
                      <input
                        type="email"
                        required
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="juan.perez@empresa.com"
                        className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px]">EMPRESA / CORPORACIÓN *</label>
                      <input
                        type="text"
                        required
                        value={leadCompany}
                        onChange={(e) => setLeadCompany(e.target.value)}
                        placeholder="Ej. Banco de México S.A."
                        className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1 text-[9px]">PUESTO / CARGO EN LA EMPRESA *</label>
                      <input
                        type="text"
                        required
                        value={leadRole}
                        onChange={(e) => setLeadRole(e.target.value)}
                        placeholder="Ej. Director Finanzas / CIO"
                        className="w-full bg-black border border-zinc-800 text-white p-3 outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <p className="text-red-500 text-[10px] py-1">* {errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary-accent w-full justify-center py-3 text-xs uppercase"
                  >
                    {loading ? 'Procesando lead...' : 'Generar PDF Personalizado'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
                  </button>
                </form>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-900 text-[10px]">
                  <button 
                    onClick={() => setStep(2)}
                    className="text-zinc-500 hover:text-white flex items-center gap-1 cursor-pointer font-bold uppercase"
                  >
                    ← Volver a Preguntas
                  </button>
                  <button 
                    onClick={handleReset}
                    className="text-zinc-600 hover:text-zinc-400 cursor-pointer font-bold uppercase"
                  >
                    [Reiniciar]
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Dynamic Concept Scorecard */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* ASCII Pitch */}
            <div className="border border-zinc-800 bg-zinc-950/40 p-4 rounded text-zinc-500 leading-normal font-mono text-[9px] overflow-x-auto whitespace-pre select-text">
{`┌────────────────────────────────────────────────────────┐
│                                                        │
│  /doctrina/generator                                   │
│                                                        │
│  "Las cláusulas contractuales clave que                │
│   cualquier integrador de Oracle Fusion Cloud          │
│   debería aceptar."                                    │
│                                                        │
│  Generado para CFOs y CIOs que planean                 │
│  transformación crítica en 2026.                       │
│                                                        │
└────────────────────────────────────────────────────────┘`}
            </div>

            {/* Why it matters panel */}
            <div className="relative border border-zinc-800 bg-black/40 p-6 space-y-4 rounded">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent/40" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-accent/40" />
              
              <span className="text-[10px] text-accent font-bold uppercase block tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-accent" /> ¿POR QUÉ EXIGIR ESTAS CLÁUSULAS?
              </span>
              
              <ul className="space-y-3 font-sans text-xs text-zinc-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 font-bold">·</span>
                  <span><strong>Desactiva Cobros Extra (Change Orders):</strong> Obliga al proveedor a absorber costos imprevistos de configuración debido a su falta de análisis inicial.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 font-bold">·</span>
                  <span><strong>Condiciona Pagos Finales:</strong> El proyecto no termina al encender el sistema (Go-Live), sino al validar con éxito el primer cierre contable.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 font-bold">·</span>
                  <span><strong>Previene Consultores Inexpertos:</strong> Otorga derecho a auditar individualmente y vetar consultores que no demuestren capacidad práctica real.</span>
                </li>
              </ul>
            </div>

            {/* Note of audit */}
            <div className="border border-zinc-900 bg-zinc-950/40 p-4 rounded text-zinc-500 font-sans text-xs leading-relaxed space-y-1">
              <span className="font-mono text-[10px] text-accent font-bold block">✓ EXENCIÓN TÉCNICA</span>
              El documento generado contiene recomendaciones técnicas y contractuales aplicables para integradores tradicionales de volumen. No sustituye la auditoría final de un asesor legal corporativo.
            </div>

          </div>

        </div>

      </div>

      {/* STEP 4: REPORT VIEW (RENDERED BOTH ON SCREEN AND TAILORED FOR PRINTING) */}
      {step === 4 && (
        <div className="max-w-4xl mx-auto space-y-8 print:p-0 print:my-0">
          
          {/* Action Bar (Hidden during Printing) */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-950/80 p-4 border border-zinc-900 rounded no-print">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div>
                <span className="text-white font-bold block text-xs">REPORTE GENERADO EXITOSAMENTE</span>
                <span className="text-[10px] text-zinc-500 font-mono">ID de Auditoría: {leadId}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handlePrint}
                className="btn-primary-accent py-2 px-4 text-xs uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Descargar PDF / Imprimir
              </button>
              <button 
                onClick={handleReset}
                className="btn-outline-accent py-2 px-4 text-xs uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Reiniciar Evaluador
              </button>
            </div>
          </div>

          {/* Printable Report Document Container */}
          <div className="bg-zinc-950/20 border border-zinc-800 p-8 md:p-12 space-y-8 rounded print:border-0 print:p-0 print:bg-white print:text-black print_card">
            
            {/* Header: Brand & Meta */}
            <div className="flex justify-between items-start border-b border-zinc-800 pb-6 print:border-black">
              <div>
                {/* Simulated Logo Text */}
                <h1 className="text-xl font-bold tracking-widest text-white print:text-black">F A B R I C</h1>
                <span className="text-[9px] text-zinc-500 block tracking-widest mt-1 uppercase print:text-zinc-600">
                  Oracle Critical Engineering · Contratos
                </span>
              </div>
              <div className="text-right text-[9px] text-zinc-500 print:text-zinc-600">
                <div>DOCUMENTO: DICTAMEN CONTRACTUAL</div>
                <div>FECHA: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div>REGISTRO: {leadId}</div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-white font-light tracking-wide print:text-black">
                Cláusulas Recomendadas para tu Próximo Contrato Oracle
              </h2>
              <p className="text-zinc-400 font-sans text-xs print:text-zinc-600 leading-relaxed">
                Dictamen preliminar redactado específicamente para <strong>{leadCompany}</strong> en base a las respuestas recopiladas en la mesa técnica de validación.
              </p>
            </div>

            {/* Metadata table of user inputs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-950 border border-zinc-900 p-4 rounded text-[10px] print:bg-zinc-100 print:border-black print:text-black">
              <div>
                <span className="text-zinc-500 block uppercase text-[8px] print:text-zinc-600">Compañía:</span>
                <span className="font-bold">{leadCompany}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase text-[8px] print:text-zinc-600">Proyecto Oracle:</span>
                <span className="font-bold">{answers.projectType as string}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase text-[8px] print:text-zinc-600">Industria:</span>
                <span className="font-bold">{answers.industry as string}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase text-[8px] print:text-zinc-600">Tamaño (Revenue):</span>
                <span className="font-bold">{answers.revenue as string}</span>
              </div>
            </div>

            {/* Generated Clauses Loop */}
            <div className="space-y-8 pt-4">
              <h3 className="text-xs text-accent font-bold uppercase tracking-widest border-b border-zinc-900 pb-2 print:text-black print:border-black">
                ── CLÁUSULAS RECOMENDADAS DE INGENIERÍA ──
              </h3>

              {generateClauses().map((clause, idx) => (
                <div key={idx} className="space-y-3 print:break-inside-avoid">
                  <h4 className="text-white font-bold text-xs font-mono print:text-black">
                    {clause.title}
                  </h4>
                  
                  {/* Clause Monospace Legalese Block */}
                  <div className="p-4 bg-zinc-950/80 border border-zinc-900 text-[10px] leading-relaxed text-zinc-300 font-mono rounded whitespace-pre-wrap select-text print:bg-zinc-50 print:border-black print:text-black">
                    {clause.text}
                  </div>

                  {/* Why it matters description */}
                  <div className="font-sans text-[11px] leading-relaxed text-zinc-400 print:text-zinc-600 pl-2 border-l-2 border-accent print:border-black">
                    <strong className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block print:text-zinc-700">Por qué es importante:</strong>
                    {clause.why}
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Disclaimer */}
            <div className="pt-8 border-t border-zinc-900 space-y-3 print:border-black print:break-inside-avoid">
              <span className="text-[10px] text-red-500 font-bold block flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> AVISO LEGAL Y EXENCIÓN
              </span>
              <p className="text-zinc-500 font-sans text-[10px] leading-relaxed print:text-zinc-600">
                Las cláusulas contractuales sugeridas en este reporte son guías de ingeniería técnica para mitigar riesgos típicos en proyectos Oracle Fusion Cloud, basadas en los patrones de fracaso documentados por la mesa técnica de FABRIC. No pretenden reemplazar, sustituir o actuar como asesoría legal formal. Se recomienda encarecidamente someter estas cláusulas a la revisión de la dirección de control y al equipo jurídico de su corporación antes de firmar compromisos definitivos con cualquier integrador.
              </p>
            </div>

            {/* Signature Block */}
            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-zinc-900 print:border-black print:break-inside-avoid">
              <div className="text-center md:text-left space-y-1">
                <span className="text-[8px] text-zinc-600 block uppercase print:text-zinc-500">MESA DE AUDITORÍA CONTRACTUAL:</span>
                <span className="text-white font-serif font-light text-sm print:text-black">Ing. Julio Alvarez</span>
                <span className="text-[9px] text-zinc-500 block print:text-zinc-600">Principal Architect, FABRIC Engine</span>
              </div>
              <div className="text-center md:text-right space-y-1">
                <span className="text-[8px] text-zinc-600 block uppercase print:text-zinc-500">ENTREGADO A:</span>
                <span className="text-white font-serif font-light text-sm print:text-black">{leadName}</span>
                <span className="text-[9px] text-zinc-500 block print:text-zinc-600">{leadRole} en {leadCompany}</span>
              </div>
            </div>

            {/* Bottom CTA Block (Hidden on Print) */}
            <div className="bg-accent/5 border border-accent/20 p-6 text-center space-y-3 rounded no-print">
              <h4 className="text-sm font-serif text-white font-light">¿Quieres que evaluemos tu contrato actual o caso específico?</h4>
              <p className="text-zinc-400 font-sans text-xs max-w-lg mx-auto">
                Agenda una sesión privada de revisión técnica 1-on-1 para auditar tus compromisos, cotizaciones o change orders sin costo.
              </p>
              <Link href="/office-hours" className="btn-primary-accent inline-flex justify-center py-2 px-6 text-xs uppercase">
                Conversa con FABRIC →
              </Link>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default function DoctrineGeneratorPage() {
  return (
    <Suspense fallback={
      <div className="bg-black text-white min-h-screen flex items-center justify-center font-mono text-xs">
        <p className="animate-pulse">Cargando Generador de Cláusulas Contractuales...</p>
      </div>
    }>
      <DoctrineGeneratorContent />
    </Suspense>
  );
}
