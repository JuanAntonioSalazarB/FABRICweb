"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Settings, 
  Database, 
  Calendar, 
  TrendingUp, 
  LogOut, 
  Trash2, 
  Save, 
  Search, 
  Info, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  Users,
  Eye,
  RefreshCw,
  Sliders,
  Link as LinkIcon,
  Copy,
  Check,
  Send,
  Zap,
  Play,
  CheckSquare,
  AlertCircle,
  Video,
  Menu,
  X
} from 'lucide-react';
import { checkSessionAction, logoutAction, syncClerkUserAction } from '@/app/actions/auth';
import { useUser, useClerk } from '@clerk/nextjs';
import { 
  getDashboardStatsAction, 
  getLeadsAndAssessmentsAction, 
  deleteLeadAction, 
  deleteAssessmentAction, 
  deleteDoctrineLeadAction,
  deleteEvidenceRequestAction,
  getBookingsAction, 
  deleteBookingAction, 
  sendMeetEmailAction,
  getSettingsAction, 
  saveSettingsAction,
  checkIntegrationsAction,
  simulatePromptFlowAction,
  getAdminAvailableSlotsAction,
  createAvailableSlotAction,
  deleteAvailableSlotAction,
  getSystemLogsAction,
  clearSystemLogsAction
} from '@/app/actions/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const [syncedUser, setSyncedUser] = useState<{ email: string; name: string; role: string } | null>(null);
  
  const [meetModalBooking, setMeetModalBooking] = useState<any | null>(null);
  const [meetModalLink, setMeetModalLink] = useState('');
  const [sendingMeet, setSendingMeet] = useState(false);
  
  // Navigation Tabs (Simplified Names)
  const [activeTab, setActiveTab] = useState<'inicio' | 'clientes' | 'reuniones' | 'ia' | 'integraciones' | 'referencias' | 'logs'>('inicio');
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Theme toggle state (default to 'light' / white theme)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on client-side mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme as 'light' | 'dark');
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('dashboard-theme', newTheme);
  };
  
  // Interactive Stats Hover state
  const [hoveredChartPoint, setHoveredChartPoint] = useState<number | null>(null);

  // Copy Feedback state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Toast System state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // AI Brain Live Tester state
  const [aiTestInput, setAiTestInput] = useState('');
  const [aiTestMessages, setAiTestMessages] = useState<{ role: 'user' | 'assistant' | 'system'; content: string }[]>([
    { role: 'assistant', content: 'Mesa técnica de FABRIC en línea. Modifica el prompt de la izquierda y hazme una pregunta para simular cómo respondería el Cerebro IA en producción.' }
  ]);
  const [aiTesting, setAiTesting] = useState(false);

  // Chart Metric and Range states
  const [chartMetric, setChartMetric] = useState<'total' | 'leads' | 'assessments' | 'bookings'>('total');
  const [rangeDays, setRangeDays] = useState<7 | 14 | 30>(7);

  // Chart Metric Themes for Visual Accent Adaptation
  const metricThemes = {
    total: {
      name: 'Interacciones Totales',
      color: '#C9A96E',
      bgGradient: 'areaGradTotal',
      lineGradient: 'lineGradTotal',
      glowFilter: 'chartGlowTotal',
      glowColor: 'rgba(201, 169, 110, 0.4)',
      accentClass: 'text-accent border-accent/30 bg-accent/5',
      badgeClass: 'badge-premium',
      strokeColor: '#C9A96E',
      secondaryColor: '#FFF5E0',
      borderSelected: 'border-accent/40 shadow-[0_0_15px_rgba(201,169,110,0.06)]'
    },
    leads: {
      name: 'Admisiones (Waitlist)',
      color: '#38bdf8',
      bgGradient: 'areaGradLeads',
      lineGradient: 'lineGradLeads',
      glowFilter: 'chartGlowLeads',
      glowColor: 'rgba(56, 189, 248, 0.4)',
      accentClass: 'text-sky-400 border-sky-500/20 bg-sky-950/10',
      badgeClass: 'border border-sky-500/20 bg-sky-950/20 text-sky-400 rounded-full px-2 py-0.5',
      strokeColor: '#38bdf8',
      secondaryColor: '#e0f2fe',
      borderSelected: 'border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.06)]'
    },
    assessments: {
      name: 'Diagnósticos de Riesgo',
      color: '#f59e0b',
      bgGradient: 'areaGradAssessments',
      lineGradient: 'lineGradAssessments',
      glowFilter: 'chartGlowAssessments',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      accentClass: 'text-amber-500 border-amber-500/20 bg-amber-950/10',
      badgeClass: 'border border-amber-500/20 bg-amber-950/20 text-amber-500 rounded-full px-2 py-0.5',
      strokeColor: '#f59e0b',
      secondaryColor: '#fef3c7',
      borderSelected: 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.06)]'
    },
    bookings: {
      name: 'Citas Programadas',
      color: '#10b981',
      bgGradient: 'areaGradBookings',
      lineGradient: 'lineGradBookings',
      glowFilter: 'chartGlowBookings',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      accentClass: 'text-emerald-500 border-emerald-500/20 bg-emerald-950/10',
      badgeClass: 'border border-emerald-500/20 bg-emerald-950/20 text-emerald-500 rounded-full px-2 py-0.5',
      strokeColor: '#10b981',
      secondaryColor: '#d1fae5',
      borderSelected: 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.06)]'
    }
  };

  const activeTheme = metricThemes[chartMetric];

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [doctrineLeads, setDoctrineLeads] = useState<any[]>([]);
  const [evidenceRequests, setEvidenceRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('09:00 AM CST');
  const [creatingSlot, setCreatingSlot] = useState(false);
  const [aiSettings, setAiSettings] = useState<any>({
    systemPrompt: '',
    localKnowledge: '',
    openaiModel: 'gpt-4o',
    temperature: 0.1,
    slackWebhook: ''
  });
  const [dbVerification, setDbVerification] = useState<any>(null);
  const [integrations, setIntegrations] = useState<any>({
    mongodb: 'disconnected',
    openai: 'inactive',
    resend: 'inactive'
  });

  // Modal / Detail States
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [selectedDoctrineLead, setSelectedDoctrineLead] = useState<any | null>(null);

  // Authenticate session on mount and sync user
  useEffect(() => {
    if (!isLoaded) return;

    async function initDashboard() {
      // Sync Clerk user with DB
      const syncRes = await syncClerkUserAction();
      if (syncRes.success && syncRes.user) {
        setSyncedUser(syncRes.user);
      } else {
        console.warn('DB Sync Warning/Error:', syncRes.error);
        // Fallback user state so UI is functional
        setSyncedUser({
          email: user?.primaryEmailAddress?.emailAddress || 'admin@fabric.engineering',
          name: user?.fullName || 'Admin Operator',
          role: 'admin'
        });
      }
      
      await refreshData(rangeDays);
      setLoading(false);
    }
    
    initDashboard();
  }, [router, isLoaded, user]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function triggerToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    setToast({ message, type });
  }

  async function refreshData(days?: number) {
    setRefreshing(true);
    const targetDays = days !== undefined ? days : rangeDays;
    try {
      const statsRes = await getDashboardStatsAction(targetDays);
      if (statsRes.success) setStats(statsRes.stats);

      const listRes = await getLeadsAndAssessmentsAction();
      if (listRes.success) {
        setLeads(listRes.leads || []);
        setAssessments(listRes.assessments || []);
        setDoctrineLeads(listRes.doctrineLeads || []);
        setEvidenceRequests(listRes.evidenceRequests || []);
      }

      const bookingsRes = await getBookingsAction();
      if (bookingsRes.success) setBookings(bookingsRes.bookings || []);

      const slotsRes = await getAdminAvailableSlotsAction();
      if (slotsRes.success) setAvailableSlots(slotsRes.slots || []);

      const settingsRes = await getSettingsAction();
      if (settingsRes.success && settingsRes.settings) {
        setAiSettings(settingsRes.settings);
        if (settingsRes.dbVerification) {
          setDbVerification(settingsRes.dbVerification);
        }
      }

      const integrationsRes = await checkIntegrationsAction();
      if (integrationsRes.success) setIntegrations(integrationsRes.status);

      const logsRes = await getSystemLogsAction();
      if (logsRes.success) setSystemLogs(logsRes.logs || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      triggerToast("Error al conectar con el servidor", "error");
    } finally {
      setRefreshing(false);
    }
  }

  function handleRangeChange(days: 7 | 14 | 30) {
    setRangeDays(days);
    refreshData(days);
  }

  async function handleLogout() {
    await signOut();
    await logoutAction();
    router.push('/login');
  }

  // Copy helper
  function handleCopy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    triggerToast(`${label} copiado al portapapeles`, "info");
    setTimeout(() => setCopiedText(null), 1500);
  }

  // Deletions
  async function handleDeleteLead(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente de la lista de espera?')) {
      const res = await deleteLeadAction(id);
      if (res.success) {
        setLeads(leads.filter(l => l._id !== id));
        triggerToast("Cliente eliminado de la lista de espera");
        refreshData();
      } else {
        triggerToast("Error al eliminar registro", "error");
      }
    }
  }

  async function handleDeleteAssessment(id: string) {
    if (confirm('¿Estás seguro de que deseas borrar los registros de este diagnóstico?')) {
      const res = await deleteAssessmentAction(id);
      if (res.success) {
        setAssessments(assessments.filter(a => a._id !== id));
        triggerToast("Registro de diagnóstico eliminado");
        refreshData();
      } else {
        triggerToast("Error al eliminar registro", "error");
      }
    }
  }

  async function handleDeleteDoctrineLead(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este lead de doctrina contractual?')) {
      const res = await deleteDoctrineLeadAction(id);
      if (res.success) {
        setDoctrineLeads(doctrineLeads.filter(d => d._id !== id));
        triggerToast("Lead de doctrina eliminado");
        refreshData();
      } else {
        triggerToast("Error al eliminar registro", "error");
      }
    }
  }

  async function handleDeleteEvidenceRequest(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta solicitud de evidencia/paper?')) {
      const res = await deleteEvidenceRequestAction(id);
      if (res.success) {
        setEvidenceRequests(evidenceRequests.filter(e => e._id !== id));
        triggerToast("Solicitud de evidencia eliminada");
        refreshData();
      } else {
        triggerToast("Error al eliminar registro", "error");
      }
    }
  }

  async function handleDeleteBooking(id: string) {
    if (confirm('¿Estás seguro de que deseas cancelar permanentemente esta reunión?')) {
      const res = await deleteBookingAction(id);
      if (res.success) {
        setBookings(bookings.filter(b => b._id !== id));
        triggerToast("Sesión técnica cancelada exitosamente");
        refreshData();
      } else {
        triggerToast("Error al cancelar reunión", "error");
      }
    }
  }

  function handleSendMeetLink(booking: any) {
    const p1 = Math.random().toString(36).substring(2, 5);
    const p2 = Math.random().toString(36).substring(2, 6);
    const p3 = Math.random().toString(36).substring(2, 5);
    setMeetModalBooking(booking);
    setMeetModalLink(`https://meet.google.com/${p1}-${p2}-${p3}`);
  }

  async function handleConfirmSendMeet() {
    if (!meetModalBooking || !meetModalLink.trim()) return;
    setSendingMeet(true);

    try {
      const res = await sendMeetEmailAction(meetModalBooking._id, meetModalLink.trim());
      if (res.success) {
        if (res.warning) {
          triggerToast(res.warning, "info");
        } else {
          triggerToast(res.message || "Enlace de Meet enviado con éxito", "success");
        }
        setMeetModalBooking(null);
      } else {
        triggerToast(res.error || "Fallo al enviar el enlace de Meet", "error");
      }
    } catch (error) {
      triggerToast("Error al procesar el envío de correo", "error");
    } finally {
      setSendingMeet(false);
    }
  }

  async function handleCreateAvailableSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!newSlotDate || !newSlotTime) {
      triggerToast('Por favor, selecciona una fecha y horario.', 'error');
      return;
    }
    setCreatingSlot(true);
    try {
      const res = await createAvailableSlotAction({ date: newSlotDate, timeSlot: newSlotTime });
      if (res.success) {
        triggerToast('Horario disponible abierto con éxito.', 'success');
        const slotsRes = await getAdminAvailableSlotsAction();
        if (slotsRes.success) setAvailableSlots(slotsRes.slots || []);
        setNewSlotDate('');
      } else {
        triggerToast(res.error || 'Error al abrir el horario.', 'error');
      }
    } catch (err) {
      triggerToast('Error de conexión con el servidor.', 'error');
    } finally {
      setCreatingSlot(false);
    }
  }

  async function handleDeleteAvailableSlot(id: string) {
    if (confirm('¿Estás seguro de que deseas remover este slot de disponibilidad?')) {
      try {
        const res = await deleteAvailableSlotAction(id);
        if (res.success) {
          triggerToast('Horario de disponibilidad removido.', 'success');
          setAvailableSlots(availableSlots.filter(s => s._id !== id));
        } else {
          triggerToast(res.error || 'Error al remover horario.', 'error');
        }
      } catch (err) {
        triggerToast('Error de conexión con el servidor.', 'error');
      }
    }
  }

  // Settings Save
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await saveSettingsAction(aiSettings);
    setSaving(false);
    if (res.success) {
      triggerToast("Configuración del Cerebro IA guardada con éxito");
      refreshData();
    } else {
      triggerToast("Error al guardar: " + res.error, "error");
    }
  }

  async function handleSaveReferencesConsent(updatedConsent: any[]) {
    setSaving(true);
    const updatedSettings = { ...aiSettings, referencesConsent: updatedConsent };
    const res = await saveSettingsAction(updatedSettings);
    setSaving(false);
    if (res.success) {
      setAiSettings(updatedSettings);
      triggerToast("Consentimientos de referencias actualizados");
      refreshData();
    } else {
      triggerToast("Error al guardar consentimientos: " + res.error, "error");
    }
  }

  // Simulated AI Brain test responses based on prompt modifications
  async function simulateAITestResponse(e: React.FormEvent) {
    e.preventDefault();
    if (!aiTestInput.trim() || aiTesting) return;

    const userMsg = aiTestInput;
    setAiTestMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setAiTestInput('');
    setAiTesting(true);

    try {
      const res = await simulatePromptFlowAction(userMsg, aiSettings);
      if (res.success && res.responseText) {
        // Map logs as system roles
        const systemLogs = (res.log || []).map(line => ({
          role: 'system' as const,
          content: line
        }));

        setAiTestMessages(prev => [
          ...prev,
          ...systemLogs,
          { role: 'assistant', content: res.responseText }
        ]);
        triggerToast("Simulación completada con éxito", "success");
      } else {
        triggerToast("Error en simulación: " + res.error, "error");
      }
    } catch (err: any) {
      console.error(err);
      triggerToast("Error de conexión al simular flujo", "error");
    } finally {
      setAiTesting(false);
    }
  }

  // Get active chart data based on selected metric and stats response
  const rawDailyStats = stats?.dailyStats || [
    { label: 'Lun', leads: 4, assessments: 6, bookings: 2, total: 12, dateStr: '2026-05-14' },
    { label: 'Mar', leads: 8, assessments: 12, bookings: 4, total: 24, dateStr: '2026-05-15' },
    { label: 'Mié', leads: 6, assessments: 9, bookings: 3, total: 18, dateStr: '2026-05-16' },
    { label: 'Jue', leads: 11, assessments: 16, bookings: 5, total: 32, dateStr: '2026-05-17' },
    { label: 'Vie', leads: 15, assessments: 22, bookings: 8, total: 45, dateStr: '2026-05-18' },
    { label: 'Sáb', leads: 9, assessments: 14, bookings: 5, total: 28, dateStr: '2026-05-19' },
    { label: 'Dom', leads: 18, assessments: 27, bookings: 9, total: 54, dateStr: '2026-05-20' }
  ];

  const chartPoints = rawDailyStats.map((pt: any) => ({
    label: pt.label,
    val: pt[chartMetric] ?? pt.total,
    leads: pt.leads ?? 0,
    assessments: pt.assessments ?? 0,
    bookings: pt.bookings ?? 0,
    dateStr: pt.dateStr || ''
  }));

  const maxVal = Math.max(...chartPoints.map((p: any) => p.val), 5);
  const stepX = chartPoints.length > 1 ? 534 / (chartPoints.length - 1) : 534;
  
  const points = chartPoints.map((pt: any, idx: number) => {
    const x = 35 + idx * stepX;
    const y = 160 - (pt.val / maxVal) * 135;
    return { 
      x, 
      y, 
      label: pt.label, 
      val: pt.val, 
      leads: pt.leads, 
      assessments: pt.assessments, 
      bookings: pt.bookings,
      dateStr: pt.dateStr 
    };
  });

  const linePath = points.length > 0 
    ? `M ${points.map((p: any) => `${p.x} ${p.y}`).join(' L ')}` 
    : '';
  
  const areaPath = points.length > 0 
    ? `M ${points[0].x} 160 L ${points.map((p: any) => `${p.x} ${p.y}`).join(' L ')} L ${points[points.length - 1].x} 160 Z`
    : '';

  // Filters
  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssessments = assessments.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctrineLeads = doctrineLeads.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvidenceRequests = evidenceRequests.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.docName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent animate-spin rounded-full"></div>
          <span className="text-zinc-500 tracking-wider">CARGANDO MESA DE CONTROL...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-mono text-xs flex flex-col relative overflow-x-hidden transition-colors duration-300 ${theme === 'light' ? 'theme-light' : 'bg-black text-zinc-200'}`}>
      
      {/* Background glowing gradients */}
      <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 transition-opacity duration-300 ${theme === 'light' ? 'bg-[#8B7355]/5 opacity-70' : 'bg-accent/5'}`}></div>
      
      {/* TOAST SYSTEM POPUP */}
      {/* TOAST SYSTEM POPUP */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in flex items-center gap-3 p-4 border border-[rgba(201,169,110,0.25)] bg-zinc-950/95 backdrop-blur-md shadow-2xl text-xs max-w-sm rounded-2xl">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-accent shrink-0" />}
          <span className="text-white font-bold">{toast.message}</span>
        </div>
      )}

      {/* CUSTOM MEET MODAL (PREMIUM HUD STYLE) */}
      {meetModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in text-[10px]">
          <div className="border border-[rgba(201,169,110,0.25)] bg-zinc-950/95 backdrop-blur-md p-6 max-w-md w-full rounded-3xl shadow-[0_10px_40px_rgba(201,169,110,0.1)] space-y-6 font-mono text-zinc-300 relative">
            
            {/* Corner Bracket decorations */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/40 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/40 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/40 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/40 rounded-br-xl" />

            {/* Header */}
            <div className="border-b border-zinc-800 pb-3.5 flex items-center justify-between">
              <span className="text-xs text-accent font-bold uppercase tracking-widest flex items-center gap-2">
                <Video className="w-4 h-4 text-accent" /> PROGRAMAR SALA DE MEET
              </span>
              <button 
                onClick={() => setMeetModalBooking(null)}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer text-sm font-sans"
              >
                ✕
              </button>
            </div>

            {/* Client summary */}
            <div className="bg-zinc-900/30 p-4 border border-zinc-900 rounded-2xl space-y-3 text-[10px] leading-relaxed">
              <div>
                <span className="text-zinc-500 uppercase block font-bold text-[8px] tracking-wider mb-0.5">Cliente / Organización</span>
                <span className="text-white font-bold">{meetModalBooking.name}</span>
                <span className="text-zinc-400 font-light block">{meetModalBooking.company} • {meetModalBooking.role}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-bold text-[8px] tracking-wider mb-0.5">Destinatario Correo</span>
                <span className="text-accent font-bold">{meetModalBooking.email}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
                <div>
                  <span className="text-zinc-500 uppercase block font-bold text-[8px] tracking-wider mb-0.5">Fecha programada</span>
                  <span className="text-white font-bold">{meetModalBooking.date}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase block font-bold text-[8px] tracking-wider mb-0.5">Horario asignado</span>
                  <span className="text-white font-bold">{meetModalBooking.timeSlot}</span>
                </div>
              </div>
            </div>

            {/* Input URL */}
            <div className="space-y-2">
              <label className="text-[9px] text-zinc-400 font-mono uppercase block font-bold tracking-wider">Enlace de Google Meet</label>
              <input
                type="text"
                value={meetModalLink}
                onChange={(e) => setMeetModalLink(e.target.value)}
                className="w-full bg-black border border-zinc-800 text-[11px] p-3.5 outline-none rounded-xl text-white font-mono focus:border-accent transition-colors shadow-inner"
                required
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setMeetModalBooking(null)}
                className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-[9px] uppercase font-bold rounded-xl transition-all cursor-pointer font-mono"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSendMeet}
                disabled={sendingMeet}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-black text-[9px] uppercase font-bold rounded-full transition-all cursor-pointer font-mono font-bold flex items-center gap-1.5 disabled:opacity-50 shadow-[0_4px_15px_rgba(201,169,110,0.15)]"
              >
                {sendingMeet ? (
                  <>
                    <span className="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full"></span>
                    Enviando...
                  </>
                ) : (
                  'Confirmar y Enviar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className="border-b border-[rgba(201,169,110,0.15)] bg-zinc-950/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Toggle on Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border border-zinc-800 hover:border-accent text-zinc-400 hover:text-accent rounded-xl transition-all cursor-pointer mr-1 bg-black/40 hover:bg-black"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="p-2 border border-accent/20 bg-accent/5 relative overflow-hidden group rounded-xl">
            <Shield className="w-5 h-5 text-accent relative z-10" />
            <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </div>
          <div>
            <h1 className="text-sm font-serif tracking-widest text-white uppercase font-light">FABRIC</h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Consola de Control de Ingeniería</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => refreshData()}
            disabled={refreshing}
            className="p-2 border border-zinc-800 hover:border-accent text-zinc-400 hover:text-accent rounded-xl transition-all duration-350 relative active:scale-95 cursor-pointer"
            title="Refrescar datos"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-accent' : ''}`} />
          </button>
          
          <div className="hidden sm:flex flex-col items-end text-[9px] text-zinc-500 font-bold">
            <span className="text-white font-bold">{user?.fullName || 'OPERADOR AUTORIZADO'}</span>
            <span className="text-[8px] text-zinc-400 font-mono tracking-wider">{user?.primaryEmailAddress?.emailAddress || 'admin@fabric.engineering'} ({syncedUser?.role || 'admin'})</span>
            <span className="text-accent flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              TELEMETRÍA ONLINE
            </span>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 border border-red-950 bg-red-950/20 hover:bg-red-900/40 px-3.5 py-2 text-[10px] font-bold text-red-400 rounded-xl transition-colors uppercase cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </header>

      {/* DASHBOARD WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row z-10">
        
        {/* Navigation Sidebar */}
        <aside className={`w-full md:w-64 border-b md:border-b-0 md:border-r border-[rgba(201,169,110,0.15)] bg-zinc-950/20 p-4 space-y-2 md:space-y-4 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider px-3 hidden md:block select-none">Módulos del Sistema</p>
          <nav className="flex flex-col gap-1.5 pb-2 md:pb-0">
            {[
              { id: 'inicio', label: 'Inicio', icon: TrendingUp },
              { id: 'clientes', label: 'Clientes & Tests', icon: Users },
              { id: 'reuniones', label: 'Reuniones', icon: Calendar },
              { id: 'ia', label: 'Cerebro IA', icon: MessageSquare },
              { id: 'referencias', label: 'Referencias', icon: Shield },
              { id: 'integraciones', label: 'Integraciones', icon: LinkIcon },
              { id: 'logs', label: 'Logs del Sistema', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-3 w-full text-left shrink-0 rounded-xl transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-accent/10 text-white font-bold shadow-[inset_0_0_12px_rgba(201,169,110,0.05)] border border-accent/20' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isSelected ? 'text-accent scale-110' : 'text-zinc-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme Switcher below Integraciones */}
          <div className="pt-4 mt-2 border-t border-[rgba(201,169,110,0.15)] space-y-2 px-3">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block select-none">Tema del Dashboard</span>
            <div className="flex gap-1.5 p-1 bg-zinc-950/40 border border-zinc-900 rounded-xl">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#8B7355] text-white font-bold shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Claro
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-800 text-white font-bold shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Oscuro
              </button>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* TAB 1: INICIO (OVERVIEW) */}
          {activeTab === 'inicio' && stats && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-zinc-800 pb-3 flex justify-between items-end">
                <div>
                  <h2 className="text-base font-serif text-white font-light">Panel General de Telemetría</h2>
                  <p className="text-zinc-500 text-[10px]">Monitoreo de leads, diagnósticos y consultas agendadas.</p>
                </div>
                <span className="badge-premium font-bold text-[9px] uppercase tracking-wider rounded-full">CONSOLA CENTRAL</span>
              </div>

              {/* Glowing Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "Clientes (Lista Espera)", val: stats.totalLeads, desc: "Registros de admisión completados", color: "border-sky-900/30 bg-sky-950/5 text-sky-400" },
                  { title: "Diagnósticos de Riesgo", val: stats.totalAssessments, desc: "Evaluaciones de ERP calculadas", color: "border-amber-900/30 bg-amber-950/5 text-amber-400" },
                  { title: "Citas Confirmadas", val: stats.totalBookings, desc: "Sesiones de consultoría técnica", color: "border-emerald-900/30 bg-emerald-950/5 text-emerald-400" }
                ].map((card, idx) => (
                  <div 
                    key={idx} 
                    className={`border bg-zinc-950/45 p-5 space-y-2.5 rounded-2xl transition-all duration-300 hover:translate-y-[-2px] hover:border-accent/40 hover:shadow-[0_10px_20px_rgba(201,169,110,0.03)] ${card.color}`}
                  >
                    <span className="text-zinc-500 uppercase block font-bold text-[9px] tracking-wider">{card.title}</span>
                    <div className="text-3xl font-serif font-light text-white flex items-center justify-between">
                      {card.val}
                      <Zap className="w-5 h-5 opacity-40 shrink-0" />
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-normal">{card.desc}</p>
                  </div>
                ))}
              </div>

              {/* Graphic Charts & Recent Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* SVG Area Chart */}
                <div className="lg:col-span-8 border border-zinc-800 bg-zinc-950/40 p-5 space-y-6 rounded-2xl">
                  
                  {/* Dynamic Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-3 gap-3">
                    <div className="space-y-1">
                      <h3 className="text-xs uppercase text-zinc-300 font-bold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-accent" /> Telemetría del Sistema
                      </h3>
                      <p className="text-[9px] text-zinc-500">Visualizando {activeTheme.name} ({rangeDays} días)</p>
                    </div>
                    
                    {/* Time range selectors */}
                    <div className="flex items-center gap-1.5 bg-zinc-950 p-1 border border-zinc-900 rounded-xl">
                      {[7, 14, 30].map((days) => (
                        <button
                          key={days}
                          onClick={() => handleRangeChange(days as 7 | 14 | 30)}
                          className={`px-2.5 py-1 text-[9px] font-bold rounded-lg cursor-pointer transition-all ${
                            rangeDays === days 
                              ? 'bg-zinc-800 text-white border border-zinc-700' 
                              : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                          }`}
                        >
                          {days}D
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Metric Selectors Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(metricThemes) as Array<keyof typeof metricThemes>).map((key) => {
                      const theme = metricThemes[key];
                      const isSelected = chartMetric === key;
                      const counts = {
                        total: (stats?.totalLeads || 0) + (stats?.totalAssessments || 0) + (stats?.totalBookings || 0),
                        leads: stats?.totalLeads || 0,
                        assessments: stats?.totalAssessments || 0,
                        bookings: stats?.totalBookings || 0
                      };
                      
                      return (
                        <button
                          key={key}
                          onClick={() => setChartMetric(key)}
                          className={`px-3 py-2 text-[10px] font-bold text-left rounded-xl transition-all border flex flex-col justify-between cursor-pointer gap-1 min-h-[52px] ${
                            isSelected 
                              ? `${theme.accentClass} ${theme.borderSelected}` 
                              : 'border-zinc-900 bg-zinc-950/10 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800'
                          }`}
                        >
                          <span className="uppercase text-[8px] tracking-wider text-zinc-500">{theme.name.split(' ')[0]}</span>
                          <span className={`text-sm font-serif font-light text-white`}>
                            {counts[key]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive SVG Chart */}
                  <div className="relative pt-2">
                    <svg className="w-full h-44 overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                      <defs>
                        {/* Area fill gradient */}
                        <linearGradient id="areaGradTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="areaGradLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="areaGradAssessments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="areaGradBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                        
                        {/* Line stroke gradient */}
                        <linearGradient id="lineGradTotal" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#C9A96E" />
                          <stop offset="50%" stopColor="#FFF5E0" />
                          <stop offset="100%" stopColor="#C9A96E" />
                        </linearGradient>
                        <linearGradient id="lineGradLeads" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#e0f2fe" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                        <linearGradient id="lineGradAssessments" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="50%" stopColor="#fef3c7" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                        <linearGradient id="lineGradBookings" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="50%" stopColor="#d1fae5" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>

                        {/* High-tech glow filters */}
                        <filter id="chartGlowTotal" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="chartGlowLeads" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="chartGlowAssessments" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="chartGlowBookings" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Y-Axis scale and horizontal gridlines */}
                      <text x="8" y="28" fill="#4b5563" fontSize="8" className="font-mono">{Math.round(maxVal)} —</text>
                      <line x1="35" y1="25" x2="580" y2="25" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 3" />
                      
                      <text x="8" y="73" fill="#4b5563" fontSize="8" className="font-mono">{Math.round(maxVal * 0.66)} —</text>
                      <line x1="35" y1="70" x2="580" y2="70" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 3" />
                      
                      <text x="8" y="118" fill="#4b5563" fontSize="8" className="font-mono">{Math.round(maxVal * 0.33)} —</text>
                      <line x1="35" y1="115" x2="580" y2="115" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 3" />
                      
                      <text x="8" y="163" fill="#4b5563" fontSize="8" className="font-mono"> 0 —</text>
                      <line x1="35" y1="160" x2="580" y2="160" stroke="rgba(255,255,255,0.08)" />

                      {/* Vertical gridlines */}
                      {points.map((pt: any, idx: number) => (
                        <line 
                          key={idx} 
                          x1={pt.x} 
                          y1="25" 
                          x2={pt.x} 
                          y2="160" 
                          stroke="rgba(255,255,255,0.015)" 
                          strokeDasharray="2 2" 
                        />
                      ))}

                      {/* Area Path */}
                      <path 
                        d={areaPath} 
                        fill={`url(#${activeTheme.bgGradient})`} 
                      />

                      {/* Line Path (with glowing filters) */}
                      <path 
                        d={linePath} 
                        fill="none" 
                        stroke={`url(#${activeTheme.lineGradient})`} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        filter={`url(#${activeTheme.glowFilter})`}
                      />

                      {/* Interactive crosshairs (Bloomberg-style target) */}
                      {hoveredChartPoint !== null && points[hoveredChartPoint] && (
                        <>
                          {/* Vertical target line */}
                          <line 
                            x1={points[hoveredChartPoint].x} 
                            y1="15" 
                            x2={points[hoveredChartPoint].x} 
                            y2="165" 
                            stroke={activeTheme.strokeColor} 
                            strokeWidth="1.2" 
                            strokeDasharray="3 3" 
                            opacity="0.4"
                          />
                          {/* Horizontal target line */}
                          <line 
                            x1="30" 
                            y1={points[hoveredChartPoint].y} 
                            x2="585" 
                            y2={points[hoveredChartPoint].y} 
                            stroke={activeTheme.strokeColor} 
                            strokeWidth="1.2" 
                            strokeDasharray="3 3" 
                            opacity="0.4"
                          />
                          {/* Outer glowing coordinate point */}
                          <circle 
                            cx={points[hoveredChartPoint].x}
                            cy={points[hoveredChartPoint].y}
                            r="9"
                            fill="none"
                            stroke={activeTheme.strokeColor}
                            strokeWidth="1"
                            opacity="0.5"
                            className="animate-ping"
                          />
                        </>
                      )}

                      {/* Interactive data nodes */}
                      {points.map((pt: any, idx: number) => (
                        <circle 
                          key={idx}
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredChartPoint === idx ? "5.5" : "4"}
                          fill={hoveredChartPoint === idx ? "#FFF" : "#000"}
                          stroke={activeTheme.strokeColor}
                          strokeWidth={hoveredChartPoint === idx ? "2.5" : "1.8"}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredChartPoint(idx)}
                          onMouseLeave={() => setHoveredChartPoint(null)}
                        />
                      ))}
                    </svg>

                    {/* X-Axis labels */}
                    <div className="relative h-5 text-[9px] text-zinc-500 pt-2 border-t border-zinc-900 mt-2 font-mono">
                      {points.map((pt: any, idx: number) => {
                        const showLabel = 
                          rangeDays <= 7 || 
                          (rangeDays === 14 && idx % 2 === 0) || 
                          (rangeDays === 30 && idx % 5 === 0) ||
                          idx === points.length - 1;
                        
                        return (
                          <span 
                            key={idx} 
                            style={{ 
                              position: 'absolute', 
                              left: `${pt.x}px`, 
                              transform: 'translateX(-50%)' 
                            }}
                            className={`cursor-pointer transition-colors ${
                              hoveredChartPoint === idx 
                                ? 'text-white font-bold' 
                                : 'text-zinc-500'
                            }`}
                            onMouseEnter={() => setHoveredChartPoint(idx)}
                            onMouseLeave={() => setHoveredChartPoint(null)}
                          >
                            {showLabel ? pt.label : ''}
                          </span>
                        );
                      })}
                    </div>

                    {/* Interactive Tooltip HUD */}
                    <div className="mt-4 flex items-center justify-center min-h-[40px]">
                      {hoveredChartPoint !== null && points[hoveredChartPoint] ? (
                        <div 
                          className="text-[10px] font-bold uppercase tracking-wider flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2 border rounded-full transition-all duration-300 bg-zinc-950"
                          style={{ borderColor: `${activeTheme.color}33`, boxShadow: `0 0 15px ${activeTheme.color}0a` }}
                        >
                          <span className="text-white flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" style={{ color: activeTheme.color }} />
                            <span>{points[hoveredChartPoint].label} ({points[hoveredChartPoint].dateStr}):</span>
                          </span>
                          <span style={{ color: activeTheme.color }}>
                            {activeTheme.name}: {points[hoveredChartPoint].val}
                          </span>
                          <span className="text-zinc-600">|</span>
                          <span className="text-sky-400">Waitlist: {points[hoveredChartPoint].leads}</span>
                          <span className="text-zinc-600">|</span>
                          <span className="text-amber-500">Diagnósticos: {points[hoveredChartPoint].assessments}</span>
                          <span className="text-zinc-600">|</span>
                          <span className="text-emerald-500">Citas: {points[hoveredChartPoint].bookings}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-zinc-600 tracking-wider">PASA EL CURSOR SOBRE LOS NODOS PARA VER DETALLES DE TELEMETRÍA DIARIA</span>
                      )}
                    </div>
                  </div>

                  {/* Distribution bars */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-900">
                    {/* Scenario Bar Chart */}
                    <div className="space-y-3">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Distribución de Escenarios</span>
                      <div className="space-y-3">
                        {[
                          { key: 'rescue', label: 'Rescate Fusion', count: stats?.scenarios?.rescue || 0, color: 'from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]' },
                          { key: 'migration', label: 'Migración Legacy', count: stats?.scenarios?.migration || 0, color: 'from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]' },
                          { key: 'greenfield', label: 'Greenfield ERP', count: stats?.scenarios?.greenfield || 0, color: 'from-zinc-600 to-zinc-400 shadow-[0_0_10px_rgba(113,113,122,0.15)]' }
                        ].map((sc) => {
                          const percentage = stats?.totalLeads > 0 ? Math.round((sc.count / stats.totalLeads) * 100) : 0;
                          return (
                            <div key={sc.key} className="space-y-1 group">
                              <div className="flex justify-between text-[9px] text-zinc-500 transition-colors group-hover:text-zinc-300">
                                <span>{sc.label}</span>
                                <span className="text-white font-bold">{sc.count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-zinc-950 h-1.5 border border-zinc-900 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${sc.color} rounded-full transition-all duration-1000 ease-out`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Risk Level Bar Chart */}
                    <div className="space-y-3">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Severidad de Diagnósticos</span>
                      <div className="space-y-3">
                        {[
                          { key: 'high', label: 'Riesgo Crítico', count: stats?.riskLevels?.high || 0, color: 'from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]' },
                          { key: 'medium', label: 'Cuello de Botella', count: stats?.riskLevels?.medium || 0, color: 'from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]' },
                          { key: 'low', label: 'Operación Estable', count: stats?.riskLevels?.low || 0, color: 'from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]' }
                        ].map((rk) => {
                          const percentage = stats?.totalAssessments > 0 ? Math.round((rk.count / stats.totalAssessments) * 100) : 0;
                          return (
                            <div key={rk.key} className="space-y-1 group">
                              <div className="flex justify-between text-[9px] text-zinc-500 transition-colors group-hover:text-zinc-300">
                                <span>{rk.label}</span>
                                <span className="text-white font-bold">{rk.count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-zinc-950 h-1.5 border border-zinc-900 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${rk.color} rounded-full transition-all duration-1000 ease-out`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Activity Feed */}
                <div className="lg:col-span-4 border border-zinc-800 bg-zinc-950/40 p-5 space-y-4 rounded-2xl">
                  <h3 className="text-xs uppercase text-zinc-300 font-bold border-b border-zinc-800 pb-2">Actividad de Mesa</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {stats.recentActivity && stats.recentActivity.length > 0 ? (
                      stats.recentActivity.map((act: any, idx: number) => (
                        <div key={idx} className="border-b border-zinc-900 pb-2.5 last:border-0 last:pb-0 flex items-start gap-2.5 hover:bg-zinc-900/10 transition-colors p-1">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${act.type === 'lead' ? 'bg-sky-400' : act.type === 'booking' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                          <div className="space-y-0.5">
                            <div className="text-white font-bold text-[11px]">{act.title}</div>
                            <div className="text-[10px] text-zinc-400">{act.subtitle}</div>
                            <div className="text-[9px] text-zinc-600 font-mono">{act.time}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-600 text-center py-6">Sin registros de actividad.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: CLIENTES & TESTS */}
          {activeTab === 'clientes' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-serif text-white font-light">Auditoría de Clientes & Diagnósticos</h2>
                  <p className="text-zinc-500 text-[10px]">Administra las solicitudes de admisión de la waitlist y las puntuaciones de riesgo.</p>
                </div>
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar cliente, correo, empresa..."
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent outline-none py-2 pl-10 pr-4 text-zinc-300 placeholder-zinc-700 rounded-full"
                  />
                </div>
              </div>

              {/* Leads / Waitlist Table */}
              <div className="space-y-3">
                <span className="badge-premium font-bold text-[9px] tracking-wider">SOLICITUDES DE ADMISIÓN (WAITLIST)</span>
                <div className="border border-zinc-800 bg-zinc-950/20 overflow-x-auto rounded-2xl">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-950">
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Compañía</th>
                        <th className="p-3">Cargo</th>
                        <th className="p-3">Escenario</th>
                        <th className="p-3">Fecha</th>
                        <th className="p-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      {filteredLeads.length > 0 ? (
                        filteredLeads.map((l) => (
                          <tr key={l._id} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                            <td className="p-3 font-bold text-white">{l.name}</td>
                            <td className="p-3">
                              <span className="flex items-center gap-1.5">
                                {l.email}
                                <button 
                                  onClick={() => handleCopy(l.email, "Correo")}
                                  className="text-zinc-600 hover:text-accent p-0.5 cursor-pointer rounded-lg hover:bg-zinc-900/50"
                                >
                                  {copiedText === l.email ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </span>
                            </td>
                            <td className="p-3 font-bold text-zinc-300">{l.company}</td>
                            <td className="p-3 text-zinc-500">{l.role}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[8px] font-bold uppercase border rounded-full ${
                                l.scenario === 'rescue' 
                                  ? 'bg-red-950/30 text-red-400 border-red-900/50' 
                                  : l.scenario === 'migration' 
                                    ? 'bg-amber-950/30 text-amber-400 border-amber-900/50' 
                                    : 'bg-zinc-900/30 text-zinc-400 border-zinc-800'
                              }`}>
                                {l.scenario === 'rescue' ? 'Rescate' : l.scenario === 'migration' ? 'Migración' : 'Greenfield'}
                              </span>
                            </td>
                            <td className="p-3 text-zinc-500 font-mono">{new Date(l.createdAt).toLocaleDateString()}</td>
                            <td className="p-3 text-center">
                              <button 
                                onClick={() => handleDeleteLead(l._id)}
                                className="text-zinc-600 hover:text-red-400 p-1 transition-colors cursor-pointer rounded-lg hover:bg-zinc-900/50"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-zinc-600">No se encontraron clientes registrados.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>



              {/* Doctrine Leads Table */}
              <div className="space-y-3 pt-4 animate-fade-in">
                <span className="badge-premium font-bold text-[9px] tracking-wider text-[#C9A96E]">LEADS DE DOCTRINA CONTRACTUAL</span>
                <div className="border border-zinc-800 bg-zinc-950/20 overflow-x-auto rounded-2xl">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-950">
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Compañía</th>
                        <th className="p-3">Cargo</th>
                        <th className="p-3">Fecha</th>
                        <th className="p-3 text-center">Respuestas</th>
                        <th className="p-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      {filteredDoctrineLeads.length > 0 ? (
                        filteredDoctrineLeads.map((d) => (
                          <tr key={d._id} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                            <td className="p-3 font-bold text-white">{d.name}</td>
                            <td className="p-3">
                              <span className="flex items-center gap-1.5">
                                {d.email}
                                <button 
                                  onClick={() => handleCopy(d.email, "Correo")}
                                  className="text-zinc-600 hover:text-accent p-0.5 cursor-pointer rounded-lg hover:bg-zinc-900/50"
                                >
                                  {copiedText === d.email ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </span>
                            </td>
                            <td className="p-3 font-bold text-zinc-300">{d.company}</td>
                            <td className="p-3 text-zinc-500">{d.role}</td>
                            <td className="p-3 text-zinc-500 font-mono">{new Date(d.createdAt).toLocaleDateString()}</td>
                            <td className="p-3 text-center">
                              <button 
                                onClick={() => setSelectedDoctrineLead(d)}
                                className="border border-accent/30 hover:border-accent bg-accent/5 px-2.5 py-1 text-accent text-[9px] uppercase font-bold rounded-xl transition-all cursor-pointer"
                              >
                                Ver Respuestas
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <button 
                                onClick={() => handleDeleteDoctrineLead(d._id)}
                                className="text-zinc-600 hover:text-red-400 p-1 transition-colors cursor-pointer rounded-lg hover:bg-zinc-900/50"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-zinc-600">No se encontraron leads de doctrina contractual.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Evidence Requests / Paper Downloads Table */}
              <div className="space-y-3 pt-4 animate-fade-in">
                <span className="badge-premium font-bold text-[9px] tracking-wider text-[#38bdf8]">SOLICITUDES DE EVIDENCIA & PAPERS TÉCNICOS</span>
                <div className="border border-zinc-800 bg-zinc-950/20 overflow-x-auto rounded-2xl">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-950">
                        <th className="p-3">Tipo</th>
                        <th className="p-3">Documento</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Compañía / Cargo</th>
                        <th className="p-3">NDA</th>
                        <th className="p-3">Fecha</th>
                        <th className="p-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      {filteredEvidenceRequests.length > 0 ? (
                        filteredEvidenceRequests.map((e) => (
                          <tr key={e._id} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[8px] font-bold uppercase border rounded-full ${
                                e.type === 'evidence' 
                                  ? 'bg-[#c9a96e]/10 text-[#c9a96e] border-[#c9a96e]/20' 
                                  : 'bg-sky-950/30 text-sky-400 border-sky-900/50'
                              }`}>
                                {e.type === 'evidence' ? 'Evidencia NDA' : 'Descarga Paper'}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-white">{e.docName}</td>
                            <td className="p-3 font-bold text-zinc-300">{e.name}</td>
                            <td className="p-3">
                              <span className="flex items-center gap-1.5">
                                {e.email}
                                <button 
                                  onClick={() => handleCopy(e.email, "Correo")}
                                  className="text-zinc-600 hover:text-accent p-0.5 cursor-pointer rounded-lg hover:bg-zinc-900/50"
                                >
                                  {copiedText === e.email ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </span>
                            </td>
                            <td className="p-3">
                              {e.company} <br />
                              <span className="text-zinc-500 text-[9px]">{e.role}</span>
                            </td>
                            <td className="p-3">
                              <span className={`font-mono text-[9px] ${e.ndaAccepted ? 'text-emerald-400' : 'text-zinc-600'}`}>
                                {e.ndaAccepted ? 'ACEPTADO' : 'N/A'}
                              </span>
                            </td>
                            <td className="p-3 text-zinc-500 font-mono">{new Date(e.createdAt).toLocaleDateString()}</td>
                            <td className="p-3 text-center">
                              <button 
                                onClick={() => handleDeleteEvidenceRequest(e._id)}
                                className="text-zinc-600 hover:text-red-400 p-1 transition-colors cursor-pointer rounded-lg hover:bg-zinc-900/50"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-zinc-600">No se encontraron solicitudes de evidencia ni descargas.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: REUNIONES (BOOKINGS) */}
          {activeTab === 'reuniones' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-zinc-800 pb-3 flex justify-between items-end">
                <div>
                  <h2 className="text-base font-serif text-white font-light">Agenda de Reuniones y Gestión de Horarios</h2>
                  <p className="text-zinc-500 text-[10px]">Administra las consultas 1-on-1 programadas en Office Hours y define tu disponibilidad horaria.</p>
                </div>
                {refreshing && (
                  <span className="text-[9px] text-zinc-500 font-mono animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Actualizando...
                  </span>
                )}
              </div>

              {/* SECTION: DISPONIBILIDAD (SLOT MANAGEMENT) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left panel: Form to add a new slot */}
                <div className="lg:col-span-1 border border-zinc-800 bg-zinc-950/20 p-4 rounded-xl space-y-4">
                  <div>
                    <h3 className="text-xs font-serif text-white font-light">Abrir Nuevo Horario</h3>
                    <p className="text-zinc-500 text-[9px]">Define un bloque de fecha y hora para consultas técnicas de clientes.</p>
                  </div>
                  
                  <form onSubmit={handleCreateAvailableSlot} className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-zinc-400 font-mono uppercase block font-bold">Fecha</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={newSlotDate}
                        onChange={(e) => setNewSlotDate(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-[10px] p-2.5 outline-none rounded-xl text-white font-mono cursor-pointer focus:border-accent"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] text-zinc-400 font-mono uppercase block font-bold">Hora Programada</label>
                      <input
                        type="text"
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                        placeholder="ej: 09:00 AM CST"
                        className="w-full bg-black border border-zinc-800 text-[10px] p-2.5 outline-none rounded-xl text-white font-mono focus:border-accent"
                        required
                      />
                      <div className="flex flex-wrap gap-1 pt-1">
                        {['09:00 AM CST', '11:00 AM CST', '02:00 PM CST', '04:00 PM CST'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewSlotTime(t)}
                            className={`px-2 py-0.5 text-[8px] font-mono rounded border transition-colors ${
                              newSlotTime === t
                                ? 'border-accent text-accent bg-accent/5'
                                : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            {t.replace(' CST', '')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={creatingSlot}
                      className="w-full border border-accent hover:bg-accent hover:text-black text-accent text-[9px] uppercase font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                    >
                      {creatingSlot ? 'Abriendo Horario...' : '[ABRIR HORARIO DISPONIBLE]'}
                    </button>
                  </form>
                </div>

                {/* Right panel: Available Slots list */}
                <div className="lg:col-span-2 border border-zinc-800 bg-zinc-950/20 p-4 rounded-xl space-y-4 flex flex-col min-h-[250px]">
                  <div>
                    <h3 className="text-xs font-serif text-white font-light">Horarios de Disponibilidad Abiertos</h3>
                    <p className="text-zinc-500 text-[9px]">Bloques de tiempo habilitados para que los clientes puedan agendar.</p>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[190px] custom-scrollbar border border-zinc-900 rounded-xl bg-black/40">
                    <table className="w-full text-left border-collapse text-[9px]">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 bg-zinc-950/80 font-mono sticky top-0">
                          <th className="p-2.5">Fecha</th>
                          <th className="p-2.5">Horario</th>
                          <th className="p-2.5">Estado</th>
                          <th className="p-2.5 text-center">Remover</th>
                        </tr>
                      </thead>
                      <tbody className="text-zinc-400 divide-y divide-zinc-900 font-mono">
                        {availableSlots.length > 0 ? (
                          [...availableSlots]
                            .sort((a, b) => {
                              const dateCompare = a.date.localeCompare(b.date);
                              if (dateCompare !== 0) return dateCompare;
                              return a.timeSlot.localeCompare(b.timeSlot);
                            })
                            .map((slot) => (
                              <tr key={slot._id} className="hover:bg-zinc-900/20 transition-colors">
                                <td className="p-2.5 font-bold text-white">{slot.date}</td>
                                <td className="p-2.5">{slot.timeSlot}</td>
                                <td className="p-2.5">
                                  {slot.isBooked ? (
                                    <span className="px-2 py-0.5 text-[8px] font-bold text-amber-500 bg-amber-950/20 border border-amber-900/50 uppercase tracking-widest rounded-full">
                                      RESERVADO
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 text-[8px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/50 uppercase tracking-widest rounded-full">
                                      DISPONIBLE
                                    </span>
                                  )}
                                </td>
                                <td className="p-2.5 text-center">
                                  <button
                                    onClick={() => handleDeleteAvailableSlot(slot._id)}
                                    className={`p-1 rounded transition-colors ${
                                      slot.isBooked 
                                        ? 'text-zinc-700 cursor-not-allowed' 
                                        : 'text-zinc-500 hover:text-red-400 hover:bg-red-950/30'
                                    }`}
                                    disabled={slot.isBooked}
                                    title={slot.isBooked ? "No se puede eliminar un horario reservado" : "Eliminar horario de disponibilidad"}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-zinc-600">No se han registrado horarios de disponibilidad aún.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SECTION: MEETINGS LIST */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-serif text-white font-light">Reuniones Agendadas por Clientes</h3>
                  <p className="text-zinc-500 text-[9px]">Listado histórico de consultas 1-on-1 activas y reservadas en el sistema.</p>
                </div>

                <div className="border border-zinc-800 bg-zinc-950/20 overflow-x-auto rounded-xl">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-950">
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Compañía / Cargo</th>
                        <th className="p-3">Fecha de Cita</th>
                        <th className="p-3">Hora Programada</th>
                        <th className="p-3">Agendamiento</th>
                        <th className="p-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      {bookings.length > 0 ? (
                        bookings.map((b) => (
                          <tr key={b._id} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                            <td className="p-3 font-bold text-white">{b.name}</td>
                            <td className="p-3">
                              <span className="flex items-center gap-1.5">
                                {b.email}
                                <button 
                                  onClick={() => handleCopy(b.email, "Correo")}
                                  className="text-zinc-600 hover:text-accent p-0.5 cursor-pointer rounded-lg hover:bg-zinc-900/50"
                                >
                                  {copiedText === b.email ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </span>
                            </td>
                            <td className="p-3">
                              {b.company} <br />
                              <span className="text-zinc-500">{b.role}</span>
                            </td>
                            <td className="p-3 font-bold text-accent font-mono">{b.date}</td>
                            <td className="p-3 font-bold text-white font-mono">{b.timeSlot}</td>
                            <td className="p-3 text-zinc-500 font-mono">{new Date(b.createdAt).toLocaleDateString()}</td>
                            <td className="p-3 text-center">
                              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                <button 
                                  onClick={() => handleSendMeetLink(b)}
                                  className="border border-accent/50 hover:border-accent bg-accent/5 hover:bg-accent/15 px-3 py-1.5 text-accent text-[9px] uppercase font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                                >
                                  Enviar Meet
                                </button>
                                <button 
                                  onClick={() => handleDeleteBooking(b._id)}
                                  className="border border-red-900/50 hover:border-red-600 bg-red-950/20 px-3 py-1.5 text-red-400 text-[9px] uppercase font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-zinc-600">No hay sesiones técnicas agendadas en la agenda.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CEREBRO IA (AI CONFIG & LIVE PREVIEW) */}
          {activeTab === 'ia' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-zinc-800 pb-3 flex justify-between items-end">
                <div>
                  <h2 className="text-base font-serif text-white font-light">Configuración del Cerebro IA</h2>
                  <p className="text-zinc-500 text-[10px]">Ajusta el motor de razonamiento del chatbot y prueba los prompts del sistema.</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="badge-premium font-bold text-[9px] uppercase tracking-wider">PREVISUALIZADOR HABILITADO</span>
                  {dbVerification ? (
                    dbVerification.connected ? (
                      <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-2 py-0.5 rounded-full font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        MONGO DB: Tablas Verificadas y Activas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] text-amber-500 bg-amber-950/30 border border-amber-900/50 px-2 py-0.5 rounded-full font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        MONGO DB: Sin Conexión (Mock)
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] text-zinc-500 bg-zinc-900/50 border border-zinc-800 px-2 py-0.5 rounded-full font-mono animate-pulse">
                      Verificando base de datos...
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form parameters */}
                <form onSubmit={handleSaveSettings} className="lg:col-span-7 space-y-5 border border-zinc-800 bg-zinc-950/40 p-5 rounded-2xl">
                  <div className="space-y-4">
                    {/* System Prompt Input */}
                    <div className="space-y-2">
                      <label className="text-white font-bold text-[10px] uppercase block tracking-wider">PROMPT DEL SISTEMA (ChatGPT Core)</label>
                      <textarea
                        rows={6}
                        value={aiSettings.systemPrompt}
                        onChange={(e) => setAiSettings({ ...aiSettings, systemPrompt: e.target.value })}
                        placeholder="Escribe el prompt principal para entrenar al chatbot interactivo de la página de inicio..."
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent outline-none p-3.5 text-zinc-300 font-mono text-[10px] leading-relaxed resize-y focus:ring-1 focus:ring-accent rounded-xl"
                      />
                      <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
                        <Info className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>Dejar en blanco aplicará las directrices doctrinarias predeterminadas de FABRIC.</span>
                      </div>
                    </div>

                    {/* Local Knowledge Input */}
                    <div className="space-y-2">
                      <label className="text-white font-bold text-[10px] uppercase block tracking-wider">CONOCIMIENTO LOCAL (Documentación de FabricSoft)</label>
                      <textarea
                        rows={6}
                        value={aiSettings.localKnowledge || ''}
                        onChange={(e) => setAiSettings({ ...aiSettings, localKnowledge: e.target.value })}
                        placeholder="Inserta aquí toda la documentación técnica sobre FabricSoft, reglas de ERP, base de datos Oracle, flujos de integraciones, etc..."
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent outline-none p-3.5 text-zinc-300 font-mono text-[10px] leading-relaxed resize-y focus:ring-1 focus:ring-accent rounded-xl"
                      />
                      <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
                        <Database className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>Este conocimiento será inyectado de forma directa al contexto de ChatGPT para resolver dudas complejas.</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Model Select */}
                    <div className="space-y-1.5">
                      <label className="text-white font-bold text-[10px] uppercase block">Modelo GPT</label>
                      <select
                        value={aiSettings.openaiModel}
                        onChange={(e) => setAiSettings({ ...aiSettings, openaiModel: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent outline-none p-3 text-white text-[11px] rounded-xl"
                      >
                        <option value="gpt-4o">gpt-4o (Precisión recomendada)</option>
                        <option value="gpt-4o-mini">gpt-4o-mini (Costo-eficiente)</option>
                        <option value="o1">o1 (Razonamiento avanzado)</option>
                        <option value="o1-mini">o1-mini (Lógica matemática pura)</option>
                        <option value="o3-mini">o3-mini (Razonamiento rápido)</option>
                        <option value="gpt-4-turbo">gpt-4-turbo (Legacy premium)</option>
                        <option value="gpt-4">gpt-4 (Clásico)</option>
                        <option value="gpt-3.5-turbo">gpt-3.5-turbo (Velocidad legacy)</option>
                      </select>
                    </div>

                    {/* Temperature Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="text-white font-bold text-[10px] uppercase">Creatividad (Temp)</label>
                        <span className="text-accent font-bold font-mono">{aiSettings.temperature}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={aiSettings.temperature}
                          onChange={(e) => setAiSettings({ ...aiSettings, temperature: parseFloat(e.target.value) })}
                          className="flex-1 accent-accent cursor-pointer bg-zinc-800 rounded-full h-1"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full inline-flex items-center justify-center gap-2 border border-accent hover:border-accent-hover bg-accent/5 hover:bg-accent/15 py-3 font-bold text-accent transition-all uppercase cursor-pointer rounded-full"
                  >
                    {saving ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-accent border-t-transparent animate-spin rounded-full"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Guardar en Servidor
                      </>
                    )}
                  </button>
                </form>

                {/* AI Interactive Tester & visualizer */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* MongoDB Storage Verification Block */}
                  <div className="border border-zinc-800 bg-zinc-950/20 p-5 space-y-4 rounded-2xl">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500 font-bold block text-[9px] uppercase tracking-wider">VERIFICACIÓN DE ALMACENAMIENTO (MONGODB)</span>
                      <Database className="w-3.5 h-3.5 text-accent" />
                    </div>
                    {dbVerification ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-zinc-400">Colección: <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded font-mono">systemprompts</code></span>
                          {dbVerification.connected ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Activa / Creada
                            </span>
                          ) : (
                            <span className="text-zinc-500 font-mono">Mock Local Activo</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-zinc-400">Colección: <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded font-mono">localknowledges</code></span>
                          {dbVerification.connected ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Activa / Creada
                            </span>
                          ) : (
                            <span className="text-zinc-500 font-mono">Mock Local Activo</span>
                          )}
                        </div>
                        {dbVerification.collectionsCreated && dbVerification.collectionsCreated.length > 0 && (
                          <div className="mt-2 p-2.5 bg-accent/5 border border-accent/10 rounded-xl text-[9px] text-accent leading-normal font-mono">
                            <strong>Colecciones Creadas:</strong> {dbVerification.collectionsCreated.join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[10px] text-zinc-500 flex items-center gap-2 font-mono">
                        <span className="w-3 h-3 border-2 border-zinc-500 border-t-transparent animate-spin rounded-full"></span>
                        Cargando estado de almacenamiento...
                      </div>
                    )}
                  </div>

                  {/* Context stack visual block */}
                  <div className="border border-zinc-800 bg-zinc-950/20 p-5 space-y-4 rounded-2xl">
                    <span className="text-zinc-500 font-bold block text-[9px] uppercase tracking-wider border-b border-zinc-900 pb-2">APILAMIENTO DE CONTEXTO IA</span>
                    
                    <div className="space-y-2 text-[9px]">
                      <div className="p-2.5 border border-amber-900/40 bg-amber-950/10 text-white font-bold flex items-center justify-between rounded-xl">
                        <span>1. PROMPT DEL SISTEMA (CONFIGURADO)</span>
                        <Zap className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <div className="p-2.5 border border-sky-900/40 bg-sky-950/10 text-zinc-300 flex items-center justify-between rounded-xl">
                        <span>2. CONOCIMIENTO LOCAL DE BOUTIQUE</span>
                        <CheckSquare className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                      <div className="p-2.5 border border-emerald-900/40 bg-emerald-950/10 text-zinc-300 flex items-center justify-between rounded-xl">
                        <span>3. HISTORIAL & COOKIE DE SESIÓN</span>
                        <Database className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="p-2.5 border border-zinc-800 bg-zinc-900/10 text-zinc-400 flex items-center justify-between rounded-xl">
                        <span>4. PREGUNTA DEL CLIENTE</span>
                        <Send className="w-3.5 h-3.5 text-zinc-500" />
                      </div>
                    </div>
                  </div>

                  {/* Simulated Terminal HUD */}
                  <div className="border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden flex flex-col h-64">
                    <div className="bg-zinc-900 px-3 py-2 flex items-center justify-between border-b border-zinc-800">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
                        Simulador de Prompt en Vivo
                      </span>
                      <span className="text-[8px] font-mono text-zinc-600">gpt-interactive-hud</span>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-2.5 font-mono text-[9px] text-zinc-300">
                      {aiTestMessages.map((msg, idx) => (
                        <div key={idx} className={msg.role === 'user' ? 'text-right' : msg.role === 'system' ? 'text-center my-1' : 'text-left'}>
                          {msg.role === 'system' ? (
                            <span className="inline-block px-3 py-1 bg-zinc-950 border border-zinc-900 text-zinc-500 rounded-lg text-[8px] tracking-wider uppercase font-sans">
                              {msg.content}
                            </span>
                          ) : (
                            <span className={`inline-block p-2 border ${
                              msg.role === 'user' 
                                ? 'bg-zinc-900 border-zinc-800 text-white rounded-xl rounded-tr-none text-left' 
                                : 'bg-accent/5 border-accent/15 text-accent rounded-xl rounded-tl-none'
                            }`}>
                              {msg.content}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={simulateAITestResponse} className="border-t border-zinc-850 p-2 bg-zinc-950 flex gap-2">
                      <input
                        type="text"
                        value={aiTestInput}
                        onChange={(e) => setAiTestInput(e.target.value)}
                        placeholder="Pregúntale a la simulación..."
                        className="flex-1 bg-zinc-900 border border-zinc-850 outline-none p-2 text-[10px] text-white rounded-xl"
                        disabled={aiTesting}
                      />
                      <button 
                        type="submit" 
                        disabled={aiTesting}
                        className="px-3 border border-accent hover:bg-accent text-accent hover:text-black transition-colors cursor-pointer rounded-xl"
                      >
                        <Play className="w-3 h-3" />
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 5: INTEGRACIONES (CONNECTIONS & WEBHOOK) */}
          {activeTab === 'integraciones' && (
            <div className="space-y-6 max-w-2xl animate-fade-in">
              <div className="border-b border-zinc-800 pb-3">
                <h2 className="text-base font-serif text-white font-light">Mesa de Integraciones & Enlaces</h2>
                <p className="text-zinc-500 text-[10px]">Monitorea las llaves API activas y configura alertas de Slack.</p>
              </div>

              {/* Status HUD grid */}
              <div className="space-y-4">
                <span className="badge-premium font-bold text-[9px] tracking-wider">HERRAMIENTAS CONECTADAS</span>
                
                <div className="border border-zinc-850 divide-y divide-zinc-900 bg-zinc-950/20 rounded-2xl overflow-hidden">
                  {[
                    { id: 'mongodb', label: 'Base de Datos MongoDB', desc: 'Almacena clientes, tests y citas', status: integrations.mongodb === 'connected', icon: Database },
                    { id: 'openai', label: 'OpenAI API Token', desc: 'Motor cognitivo del chatbot terminal', status: integrations.openai === 'active', icon: MessageSquare },
                    { id: 'resend', label: 'Despachador Resend Mailer', desc: 'Envío de confirmaciones automáticas', status: integrations.resend === 'active', icon: Send }
                  ].map((it) => {
                    const Icon = it.icon;
                    return (
                      <div key={it.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-accent" />
                          <div>
                            <span className="text-white font-bold block text-[11px]">{it.label}</span>
                            <span className="text-[10px] text-zinc-500">{it.desc}</span>
                          </div>
                        </div>
                        {it.status ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[8px] font-bold text-emerald-500 border border-emerald-900 bg-emerald-950/20 uppercase tracking-wider rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> ACTIVO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[8px] font-bold text-red-500 border border-red-900 bg-red-950/20 uppercase tracking-wider rounded-full">
                            <XCircle className="w-3 h-3" /> FALTANTE
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Webhook Form */}
              <div className="space-y-3 pt-3">
                <span className="badge-premium font-bold text-[9px] tracking-wider">WEBHOOKS DE ALERTAS (SLACK)</span>
                
                <form onSubmit={handleSaveSettings} className="border border-zinc-850 bg-zinc-950/40 p-5 space-y-4 rounded-2xl">
                  <div className="space-y-2">
                    <label className="text-white font-bold text-[10px] uppercase block">URL del Webhook de Slack</label>
                    <input
                      type="url"
                      value={aiSettings.slackWebhook || ''}
                      onChange={(e) => setAiSettings({ ...aiSettings, slackWebhook: e.target.value })}
                      placeholder="https://hooks.slack.com/services/T00000/B0000/XXXXXXXXXXXX"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent outline-none p-3 text-zinc-300 text-[11px] placeholder-zinc-800 rounded-xl"
                    />
                    <div className="p-3 border border-dashed border-zinc-800 text-zinc-500 leading-normal text-[9px] flex gap-2.5 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>
                        Se despachará una notificación a esta URL de webhook cada vez que un prospecto solicite acceso a la waitlist, se complete un test diagnóstico de riesgo o se agende una reunión Office Hours.
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 border border-accent hover:border-accent-hover bg-accent/5 hover:bg-accent/15 px-5 py-2.5 font-bold text-accent transition-all uppercase cursor-pointer rounded-full"
                  >
                    {saving ? 'Guardando...' : 'Actualizar Webhook'}
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 6: REFERENCIAS (CLIENTS CONSENT & VALIDATION STATUS) */}
          {activeTab === 'referencias' && (
            <div className="space-y-6 max-w-4xl animate-fade-in">
              <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-serif text-white font-light">Validación de Consentimiento de Referencias</h2>
                  <p className="text-zinc-500 text-[10px]">Gestiona de forma personal y confidencial la disponibilidad de los 5 clientes que aceptan llamadas.</p>
                </div>
                <span className="badge-premium font-bold text-[9px] tracking-wider uppercase">Filtro de Privacidad</span>
              </div>

              <div className="p-4 border border-zinc-850 bg-zinc-950/20 text-zinc-400 rounded-2xl text-[10px] leading-normal flex gap-2.5">
                <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold uppercase block mb-1">Nota de Seguridad Operativa</span>
                  Los nombres de contacto (por ejemplo, <strong className="text-white">CFO APE Plazas</strong>) y empresas reales <strong className="text-white">NO se publican</strong> en la página frontal ni en la ruta pública <code className="text-accent bg-black/40 px-1.5 py-0.5 rounded font-mono text-[9px]">/referencias</code>. El sistema las enmascara automáticamente utilizando los cargos descriptivos en LATAM para proteger a tus referencias de llamadas exploratorias sin calificar.
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="badge-premium font-bold text-[9px] tracking-wider">LISTA DE REFERENCIAS COMPROMETIDAS</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newConsent = [...(aiSettings.referencesConsent || [])];
                      newConsent.push({
                        id: 'ref-' + Date.now(),
                        name: 'Nueva Referencia',
                        company: 'Compañía',
                        title: 'Cargo descriptivo público',
                        subtitle: 'Industria / Volumen',
                        context: 'Detalle del caso...',
                        iconName: 'building',
                        consentStatus: 'pending',
                        lastValidated: new Date().toISOString().split('T')[0],
                        method: 'personal'
                      });
                      setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                    }}
                    className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-950/25 hover:bg-emerald-900/30 text-emerald-400 font-bold px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-wider transition-all cursor-pointer font-mono"
                  >
                    + Agregar Referencia
                  </button>
                </div>

                <div className="border border-zinc-850 divide-y divide-zinc-900 bg-zinc-950/40 rounded-2xl overflow-hidden">
                  {(aiSettings.referencesConsent || []).map((ref: any, idx: number) => (
                    <div key={ref.id || idx} className="p-5 space-y-4 hover:bg-zinc-900/10 transition-colors">
                      {/* Top Row: Title/Identification & Status & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-zinc-500 text-[8px] font-mono uppercase tracking-widest block">ID: {ref.id}</span>
                          <span className="text-white font-bold text-[12px]">{ref.name || 'Nueva Referencia'}</span>
                        </div>

                        {/* Status Selectors & Trash Button */}
                        <div className="flex items-center gap-3 shrink-0 flex-wrap">
                          <label className="text-[9px] text-zinc-500 uppercase font-bold">Estado:</label>
                          <select
                            value={ref.consentStatus}
                            onChange={(e) => {
                              const newConsent = [...aiSettings.referencesConsent];
                              newConsent[idx] = { ...ref, consentStatus: e.target.value };
                              setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                            }}
                            className="bg-black border border-zinc-850 text-[10px] p-1.5 outline-none rounded-lg text-white font-mono cursor-pointer"
                          >
                            <option value="confirmed">Confirmado / Activo</option>
                            <option value="pending">Pendiente / En Espera</option>
                            <option value="revoked">Revocado / Temporalmente Inactivo</option>
                          </select>

                          {/* Quick Badge indicator */}
                          {ref.consentStatus === 'confirmed' && (
                            <span className="px-2 py-0.5 text-[8px] font-bold text-emerald-500 bg-emerald-950/20 border border-emerald-900 uppercase tracking-widest rounded-full">✓ OK</span>
                          )}
                          {ref.consentStatus === 'pending' && (
                            <span className="px-2 py-0.5 text-[8px] font-bold text-amber-500 bg-amber-950/20 border border-amber-900 uppercase tracking-widest rounded-full">⌛ PEND</span>
                          )}
                          {ref.consentStatus === 'revoked' && (
                            <span className="px-2 py-0.5 text-[8px] font-bold text-red-500 bg-red-950/20 border border-red-900 uppercase tracking-widest rounded-full">❌ BAJA</span>
                          )}

                          {/* Delete Action Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('¿Estás seguro de que deseas eliminar esta referencia?')) {
                                const newConsent = aiSettings.referencesConsent.filter((r: any) => r.id !== ref.id);
                                setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                              }
                            }}
                            className="p-1.5 border border-red-900/40 bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar Referencia"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inputs Grid for Reference Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-900">
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase block font-bold">Nombre del Contacto</label>
                          <input
                            type="text"
                            value={ref.name || ''}
                            onChange={(e) => {
                              const newConsent = [...aiSettings.referencesConsent];
                              newConsent[idx] = { ...ref, name: e.target.value };
                              setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-zinc-300 text-[10px] outline-none focus:border-accent rounded-lg"
                            placeholder="CFO APE Plazas"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase block font-bold">Compañía Real</label>
                          <input
                            type="text"
                            value={ref.company || ''}
                            onChange={(e) => {
                              const newConsent = [...aiSettings.referencesConsent];
                              newConsent[idx] = { ...ref, company: e.target.value };
                              setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-zinc-300 text-[10px] outline-none focus:border-accent rounded-lg"
                            placeholder="APE Plazas"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase block font-bold">Cargo Público (Título)</label>
                          <input
                            type="text"
                            value={ref.title || ''}
                            onChange={(e) => {
                              const newConsent = [...aiSettings.referencesConsent];
                              newConsent[idx] = { ...ref, title: e.target.value };
                              setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-zinc-300 text-[10px] outline-none focus:border-accent rounded-lg"
                            placeholder="CFO de operadora de centros comerciales"
                          />
                        </div>
                      </div>

                      {/* Second Row of Inputs (subtitle, context, iconName) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase block font-bold">Industria / Subtítulo</label>
                          <input
                            type="text"
                            value={ref.subtitle || ''}
                            onChange={(e) => {
                              const newConsent = [...aiSettings.referencesConsent];
                              newConsent[idx] = { ...ref, subtitle: e.target.value };
                              setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-zinc-300 text-[10px] outline-none focus:border-accent rounded-lg"
                            placeholder="Industria: Inmobiliaria / Centros Comerciales (LATAM)"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase block font-bold">Contexto / Detalle Operativo</label>
                          <input
                            type="text"
                            value={ref.context || ''}
                            onChange={(e) => {
                              const newConsent = [...aiSettings.referencesConsent];
                              newConsent[idx] = { ...ref, context: e.target.value };
                              setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-zinc-300 text-[10px] outline-none focus:border-accent rounded-lg"
                            placeholder="Detalle del caso..."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase block font-bold">Icono Visual</label>
                          <select
                            value={ref.iconName || 'building'}
                            onChange={(e) => {
                              const newConsent = [...aiSettings.referencesConsent];
                              newConsent[idx] = { ...ref, iconName: e.target.value };
                              setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-zinc-300 text-[10px] outline-none focus:border-accent rounded-lg cursor-pointer"
                          >
                            <option value="building">Edificio (building)</option>
                            <option value="landmark">Banco (landmark)</option>
                            <option value="wallet">Billetera (wallet)</option>
                            <option value="users">Usuarios (users)</option>
                            <option value="award">Premio (award)</option>
                          </select>
                        </div>
                      </div>

                      {/* Third Row of Inputs (lastValidated, method) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase block font-bold">Fecha de Última Validación</label>
                          <input
                            type="date"
                            value={ref.lastValidated || ''}
                            onChange={(e) => {
                              const newConsent = [...aiSettings.referencesConsent];
                              newConsent[idx] = { ...ref, lastValidated: e.target.value };
                              setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-zinc-300 text-[10px] outline-none focus:border-accent rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase block font-bold">Método de Validación</label>
                          <select
                            value={ref.method || 'personal'}
                            onChange={(e) => {
                              const newConsent = [...aiSettings.referencesConsent];
                              newConsent[idx] = { ...ref, method: e.target.value };
                              setAiSettings({ ...aiSettings, referencesConsent: newConsent });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-zinc-300 text-[10px] outline-none focus:border-accent rounded-lg cursor-pointer"
                          >
                            <option value="personal">Gestión Personal Directa</option>
                            <option value="agreement">Acuerdo de Confidencialidad Escrito (NDA)</option>
                            <option value="meeting">Llamada de Alineación Trimestral</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-start">
                  <button
                    onClick={() => handleSaveReferencesConsent(aiSettings.referencesConsent)}
                    disabled={saving}
                    className="inline-flex items-center gap-2 border border-accent hover:border-accent-hover bg-accent/5 hover:bg-accent/15 px-6 py-2.5 font-bold text-accent transition-all uppercase cursor-pointer rounded-full"
                  >
                    {saving ? 'Guardando...' : 'Guardar Referencias'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: LOGS DEL SISTEMA */}
          {activeTab === 'logs' && (
            <div className="space-y-6 max-w-5xl animate-fade-in">
              <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-serif text-white font-light">Logs de Actividad del Sistema</h2>
                  <p className="text-zinc-500 text-[10px]">Monitoreo de telemetría en tiempo real de base de datos, correos, admisiones e integraciones.</p>
                </div>
                <button
                  onClick={async () => {
                    if (confirm('¿Estás seguro de que deseas vaciar el historial de logs?')) {
                      await clearSystemLogsAction();
                      refreshData();
                    }
                  }}
                  className="px-3.5 py-1.5 border border-red-900/40 bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-xl text-[9px] uppercase font-bold transition-all cursor-pointer font-mono flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Vaciar Historial
                </button>
              </div>

              {/* Filtering / Statistics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[9px]">
                <div className="card-premium p-3 bg-zinc-950/20 border border-zinc-900 flex flex-col justify-between">
                  <span className="text-zinc-500 block uppercase font-bold">INFO LOGS</span>
                  <span className="text-white text-base font-bold font-sans mt-1">
                    {systemLogs.filter(l => l.level === 'info').length}
                  </span>
                </div>
                <div className="card-premium p-3 bg-zinc-950/20 border border-zinc-900 flex flex-col justify-between">
                  <span className="text-emerald-500 block uppercase font-bold">SUCCESS LOGS</span>
                  <span className="text-emerald-400 text-base font-bold font-sans mt-1">
                    {systemLogs.filter(l => l.level === 'success').length}
                  </span>
                </div>
                <div className="card-premium p-3 bg-zinc-950/20 border border-zinc-900 flex flex-col justify-between">
                  <span className="text-amber-500 block uppercase font-bold">WARN LOGS</span>
                  <span className="text-amber-400 text-base font-bold font-sans mt-1">
                    {systemLogs.filter(l => l.level === 'warn').length}
                  </span>
                </div>
                <div className="card-premium p-3 bg-zinc-950/20 border border-zinc-900 flex flex-col justify-between">
                  <span className="text-red-500 block uppercase font-bold">ERROR LOGS</span>
                  <span className="text-red-400 text-base font-bold font-sans mt-1">
                    {systemLogs.filter(l => l.level === 'error').length}
                  </span>
                </div>
              </div>

              {/* Logs Table Console Container */}
              <div className="border border-zinc-850 bg-black/80 rounded-2xl overflow-hidden font-mono shadow-2xl relative">
                {/* Console header */}
                <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between text-[9px] text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                    <span className="ml-2">fabric_system_console.log</span>
                  </div>
                  <button 
                    onClick={() => refreshData()}
                    className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} /> Refrescar
                  </button>
                </div>

                <div className="max-h-[500px] overflow-y-auto p-4 space-y-2 text-[10px] leading-relaxed">
                  {systemLogs.length === 0 ? (
                    <div className="text-zinc-600 text-center py-10">
                      [TERMINAL LOG EMPTY] No se han registrado eventos en esta sesión.
                    </div>
                  ) : (
                    systemLogs.map((log) => {
                      let levelColor = 'text-zinc-400';
                      let levelBg = 'bg-zinc-900/40 border-zinc-800';
                      if (log.level === 'success') {
                        levelColor = 'text-emerald-400';
                        levelBg = 'bg-emerald-950/20 border-emerald-900/30';
                      } else if (log.level === 'warn') {
                        levelColor = 'text-amber-400';
                        levelBg = 'bg-amber-950/20 border-amber-900/30';
                      } else if (log.level === 'error') {
                        levelColor = 'text-red-400';
                        levelBg = 'bg-red-950/20 border-red-900/30';
                      }

                      let categoryIcon = '[SYS]';
                      if (log.category === 'email') categoryIcon = '[MAIL]';
                      else if (log.category === 'database') categoryIcon = '[DB]';
                      else if (log.category === 'auth') categoryIcon = '[AUTH]';
                      else if (log.category === 'lead') categoryIcon = '[LEAD]';

                      return (
                        <div key={log._id} className="border-b border-zinc-900/60 pb-2 hover:bg-zinc-900/10 p-1 rounded transition-colors flex gap-4 items-start font-mono">
                          {/* Timestamp */}
                          <span className="text-zinc-600 shrink-0 select-none">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>

                          {/* Level Badge */}
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-widest border uppercase ${levelColor} ${levelBg} shrink-0`}>
                            {log.level}
                          </span>

                          {/* Category Tag */}
                          <span className="text-accent shrink-0 font-bold font-mono">
                            {categoryIcon}
                          </span>

                          {/* Message */}
                          <div className="flex-1 space-y-1">
                            <p className="text-zinc-300 font-sans">{log.message}</p>
                            {log.details && (
                              <pre className="text-[8px] text-zinc-500 bg-zinc-950/60 p-2 border border-zinc-900 rounded overflow-x-auto select-all max-w-full font-mono">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ASSESSMENT DETAILS HUD MODAL */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl border border-[rgba(201,169,110,0.15)] bg-zinc-950 p-6 space-y-5 max-h-[85vh] overflow-y-auto relative animate-scale-up rounded-3xl">
            
            <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
              <div>
                <span className="badge-premium font-bold text-[9px] mb-1.5 inline-block tracking-wider">DIAGNÓSTICO TÉCNICO COMPLETO</span>
                <h3 className="text-base text-white font-bold">{selectedAssessment.company}</h3>
              </div>
              <button 
                onClick={() => setSelectedAssessment(null)}
                className="text-[10px] border border-zinc-800 hover:border-zinc-500 bg-zinc-900/50 hover:bg-zinc-900 px-3 py-1.5 font-bold font-mono cursor-pointer rounded-xl transition-all"
              >
                CERRAR HUD
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] border-b border-zinc-900 pb-4">
              <div>
                <span className="text-zinc-500 uppercase block font-bold">CLIENTE DE ADMISIÓN</span>
                <span className="text-white font-bold">{selectedAssessment.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-bold">EMAIL DE CONTACTO</span>
                <span className="text-white">{selectedAssessment.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-bold">CARGO</span>
                <span className="text-white">{selectedAssessment.role}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-bold">FECHA REGISTRO</span>
                <span className="text-zinc-300 font-mono">{new Date(selectedAssessment.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-bold">PUNTUACIÓN DE RIESGO</span>
                <span className="text-white font-bold">{selectedAssessment.score} Sí de 12 preguntas</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-bold">ESTADO DE SEVERIDAD</span>
                <span className={`font-bold uppercase ${selectedAssessment.score > 8 ? 'text-red-500 animate-pulse' : selectedAssessment.score > 3 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {selectedAssessment.riskLevel}
                </span>
              </div>
            </div>

            {/* Questions breakdown */}
            <div className="space-y-3">
              <span className="text-white font-bold text-[10px] uppercase block tracking-wider">Desglose de Respuestas del Cuestionario</span>
              
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-2 divide-y divide-zinc-900">
                {[
                  "¿El cierre contable mensual toma más de 5 días hábiles?",
                  "¿Tu equipo de finanzas concilia el IVA o CFDI en Excel externo?",
                  "¿Descuadres entre auxiliar de Cuentas por Cobrar (AR) y Libro Mayor (GL)?",
                  "¿Conciliación manual de tres vías (3-way match) fuera del ERP?",
                  "¿Velocidad de timbrado de CFDI colapsa flujos en picos?",
                  "¿Tickets de soporte de severidad 1 o 2 abiertos hace más de 4 semanas?",
                  "¿Desarrollos a la medida modificando la base estándar del ERP?",
                  "¿Ingesta de extractos bancarios diarios (H2H) con intervención manual?",
                  "¿Tiempos de respuesta lentos en consultas de reportería básica?",
                  "¿Consultores proponen workarounds en lugar de soluciones reales?",
                  "¿Diagramas de integraciones SOAP/REST desactualizados/inexistentes?",
                  "¿El personal de IT no comprende el modelo de datos nativo?"
                ].map((q, idx) => (
                  <div key={idx} className="pt-2.5 flex justify-between gap-4">
                    <span className="text-zinc-400">{idx + 1}. {q}</span>
                    <span className={`font-bold font-mono shrink-0 ${selectedAssessment.answers[idx] === 1 ? 'text-red-500' : 'text-zinc-600'}`}>
                      {selectedAssessment.answers[idx] === 1 ? 'SÍ' : 'NO'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-900">
              <button 
                onClick={() => setSelectedAssessment(null)}
                className="border border-zinc-800 hover:border-accent bg-zinc-950 px-6 py-2 rounded-full font-bold hover:text-accent transition-colors cursor-pointer"
              >
                Regresar a la Consola
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DOCTRINE LEAD DETAILS HUD MODAL */}
      {selectedDoctrineLead && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl border border-[rgba(201,169,110,0.15)] bg-zinc-950 p-6 space-y-5 max-h-[85vh] overflow-y-auto relative animate-scale-up rounded-3xl">
            
            <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
              <div>
                <span className="badge-premium font-bold text-[9px] mb-1.5 inline-block tracking-wider">DIAGNÓSTICO DE DOCTRINA CONTRACTUAL</span>
                <h3 className="text-base text-white font-bold">{selectedDoctrineLead.company}</h3>
              </div>
              <button 
                onClick={() => setSelectedDoctrineLead(null)}
                className="text-[10px] border border-zinc-800 hover:border-zinc-500 bg-zinc-900/50 hover:bg-zinc-900 px-3 py-1.5 font-bold font-mono cursor-pointer rounded-xl transition-all"
              >
                CERRAR HUD
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] border-b border-zinc-900 pb-4">
              <div>
                <span className="text-zinc-500 uppercase block font-bold">CLIENTE DE ADMISIÓN</span>
                <span className="text-white font-bold">{selectedDoctrineLead.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-bold">EMAIL DE CONTACTO</span>
                <span className="text-white">{selectedDoctrineLead.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-bold">CARGO</span>
                <span className="text-white">{selectedDoctrineLead.role}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-bold">FECHA REGISTRO</span>
                <span className="text-zinc-300 font-mono">{new Date(selectedDoctrineLead.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Answers breakdown */}
            <div className="space-y-4">
              <span className="text-white font-bold text-[10px] uppercase block tracking-wider">Especificaciones del Proyecto</span>
              
              <div className="space-y-3 text-[11px]">
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 uppercase font-bold text-[9px]">Tipo de Proyecto</span>
                  <span className="text-white bg-zinc-900/50 p-2 border border-zinc-850 rounded-xl">
                    {selectedDoctrineLead.answers?.projectType || 'No especificado'}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 uppercase font-bold text-[9px]">Industria / Vertical</span>
                  <span className="text-white bg-zinc-900/50 p-2 border border-zinc-850 rounded-xl">
                    {selectedDoctrineLead.answers?.industry || 'No especificado'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 uppercase font-bold text-[9px]">Presupuesto / Ingreso Anual Estimado</span>
                  <span className="text-white bg-zinc-900/50 p-2 border border-zinc-850 rounded-xl">
                    {selectedDoctrineLead.answers?.revenue || 'No especificado'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 uppercase font-bold text-[9px]">Timeline Crítico / Plazo de Entrega</span>
                  <span className="text-white bg-zinc-900/50 p-2 border border-zinc-850 rounded-xl">
                    {selectedDoctrineLead.answers?.timeline || 'No especificado'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 uppercase font-bold text-[9px]">Rol en el Proyecto</span>
                  <span className="text-white bg-zinc-900/50 p-2 border border-zinc-850 rounded-xl">
                    {selectedDoctrineLead.answers?.roleInProject || 'No especificado'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 uppercase font-bold text-[9px]">Principales Preocupaciones / Riesgos Identificados</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {Array.isArray(selectedDoctrineLead.answers?.concerns) ? (
                      selectedDoctrineLead.answers.concerns.map((concern: string, index: number) => (
                        <span key={index} className="px-2.5 py-1 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg text-[10px]">
                          {concern}
                        </span>
                      ))
                    ) : selectedDoctrineLead.answers?.concerns ? (
                      <span className="px-2.5 py-1 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg text-[10px]">
                        {String(selectedDoctrineLead.answers.concerns)}
                      </span>
                    ) : (
                      <span className="text-zinc-600 italic">Ninguna preocupación listada</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-900">
              <button 
                onClick={() => setSelectedDoctrineLead(null)}
                className="border border-zinc-800 hover:border-accent bg-zinc-950 px-6 py-2 rounded-full font-bold hover:text-accent transition-colors cursor-pointer"
              >
                Regresar a la Consola
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
