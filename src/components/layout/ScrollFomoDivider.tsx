import React from 'react';

interface ScrollFomoDividerProps {
  label: string;
  targetId: string;
}

export default function ScrollFomoDivider({ label, targetId }: ScrollFomoDividerProps) {
  return (
    <div className="w-full bg-black py-8 select-none font-mono text-[9px] md:text-[10px] text-zinc-600 hover:text-accent transition-colors duration-500">
      <div className="w-full flex items-center max-w-6xl mx-auto px-4 md:px-8">
        <div className="h-px bg-zinc-900/60 grow" />
        <a 
          href={`#${targetId}`} 
          className="mx-4 uppercase tracking-widest text-center flex items-center gap-2 group cursor-pointer"
        >
          <span className="group-hover:text-accent transition-colors duration-300">
            {label}
          </span>
          <span className="inline-block animate-bounce text-accent group-hover:scale-115 transition-transform font-bold">
            ↴
          </span>
        </a>
        <div className="h-px bg-zinc-900/60 grow" />
      </div>
    </div>
  );
}
