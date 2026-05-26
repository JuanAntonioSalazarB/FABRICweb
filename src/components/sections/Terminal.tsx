import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Send } from 'lucide-react';
import { chatAction } from '@/app/actions/chat';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function Terminal() {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalMessages, setTerminalMessages] = useState<Message[]>([
    { role: 'assistant', content: 'FABRIC OS v1.0.0 critical consulting console initialized.\nType your Oracle Fusion Cloud or database issue below to consult our context engine.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState('SYSTEM: Consultando base de conocimiento...');
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const displayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScroll = () => {
    if (inputRef.current && displayRef.current) {
      displayRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    if (inputRef.current && displayRef.current) {
      displayRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  }, [terminalInput]);

  // Scroll to terminal bottom on new messages (container only, keeps window viewport static)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [terminalMessages, isTyping]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const userMsg: Message = { role: 'user', content: terminalInput };
    setTerminalMessages(prev => [...prev, userMsg]);
    setTerminalInput('');
    setTypingStatus('SYSTEM: Consultando base de conocimiento...');
    setIsTyping(true);

    const history = [...terminalMessages, userMsg];
    const res = await chatAction(history);

    setIsTyping(false);
    if (res.success && res.response) {
      setTerminalMessages(prev => [
        ...prev,
        { role: 'assistant', content: res.response || '' }
      ]);
    } else {
      setTerminalMessages(prev => [
        ...prev,
        { role: 'assistant', content: res.error || 'Error: No se pudo conectar con el motor técnico.' }
      ]);
    }
  };

  return (
    <section id="terminal" className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-black font-mono">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 reveal-on-scroll">
            <span className="badge-premium mb-4 inline-block">INTERACTIVE CONSULTANT</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light mb-4">
              ¿Estás resolviendo a ciegas los bugs de tu base de datos? <span className="text-accent">Accede ya al conocimiento acumulado de años de fallas.</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Hemos inyectado nuestro histórico de logs, soluciones a bugs de base de datos Oracle, conciliaciones de CFDI 4.0 en México y especificaciones FSO en un agente consultor local.
            </p>
            <div className="p-4 bg-zinc-950 border border-[rgba(201,169,110,0.15)] space-y-2 text-xs text-zinc-500">
              <p className="text-white font-bold">Pruebas sugeridas:</p>
              <button
                onClick={() => setTerminalInput('¿Qué pasa en la integración CFDI de APE Plazas?')}
                className="block text-accent hover:underline text-left cursor-pointer"
              >
                &gt; ¿Qué pasa en la integración CFDI de APE Plazas?
              </button>
              <button
                onClick={() => setTerminalInput('Explícame la garantía contractual de estabilización')}
                className="block text-accent hover:underline text-left cursor-pointer"
              >
                &gt; Explícame la garantía contractual de estabilización
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 reveal-on-scroll reveal-delay-200">
            <div className="border border-zinc-800 rounded-lg overflow-hidden bg-black shadow-2xl relative">
              {/* Scanline Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03] z-20" 
                style={{
                  backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                  backgroundSize: '100% 4px, 6px 100%'
                }}
              />

              {/* Terminal Header */}
              <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/20"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/20"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/20"></span>
                  <span className="text-[10px] text-zinc-500 font-mono ml-2">fabric-os-console</span>
                </div>
                <TerminalIcon className="w-4 h-4 text-zinc-500" />
              </div>

              {/* Status HUD Panel */}
              <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-900 flex flex-wrap items-center justify-between text-[8px] md:text-[9px] font-mono text-zinc-500 tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span>FSO ENGINE: <span className="text-emerald-500 font-bold">ONLINE</span></span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <span>ENCRYPTION: <span className="text-accent font-bold">AES-256 SECURED</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>INTEGRITY CHECK: <span className="text-accent font-bold">100%</span></span>
                </div>
              </div>

              {/* Terminal Body */}
              <div 
                ref={terminalBodyRef}
                className="p-6 h-[320px] overflow-y-auto text-xs space-y-4 font-mono text-zinc-400 relative z-10"
              >
                {terminalMessages.map((msg, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-[10px] text-zinc-600 font-bold">
                       {msg.role === 'user' ? 'GUEST@FABRIC:~$' : 'SYSTEM@FABRIC:~$'}
                    </div>
                    <div className="whitespace-pre-line leading-relaxed text-zinc-300">
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="text-[10px] text-zinc-500 animate-pulse font-mono font-bold">
                    {typingStatus}
                  </div>
                )}
              </div>

              {/* Terminal Input */}
              <form onSubmit={handleChatSubmit} className="bg-zinc-950 border-t border-zinc-800 p-3 flex items-center gap-2">
                <div className="flex-1 relative flex items-center font-mono text-xs overflow-hidden h-6">
                  <span className="text-accent shrink-0 mr-1.5 select-none">&gt;</span>
                  
                  <div className="flex-1 relative h-full">
                    {/* Display Representation */}
                    <div 
                      ref={displayRef}
                      className="absolute inset-0 flex items-center pointer-events-none select-none overflow-x-hidden whitespace-nowrap scroll-smooth"
                    >
                      {terminalInput ? (
                        <span className="text-white">
                          {terminalInput}
                          <span className="text-accent animate-blink">_</span>
                        </span>
                      ) : (
                        <span className="text-zinc-700 flex items-center">
                          Pregunta sobre ERP TCO, APE Plazas, Aplazo...
                          <span className="text-accent animate-blink">_</span>
                        </span>
                      )}
                    </div>

                    {/* Actual Input */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onScroll={handleScroll}
                      className="absolute inset-0 w-full h-full bg-transparent border-0 outline-none text-transparent caret-transparent px-0 font-mono text-xs z-10 selection:bg-accent/30 selection:text-white"
                    />
                  </div>
                </div>
                
                <button type="submit" className="p-1 hover:text-accent text-zinc-600 transition-colors shrink-0 z-10">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
