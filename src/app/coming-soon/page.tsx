"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6 card-premium p-8 font-mono">
        <Clock className="w-12 h-12 text-accent mx-auto animate-pulse" />
        <h1 className="text-2xl font-serif text-white font-light">Sección en Desarrollo</h1>
        <p className="text-zinc-500 text-xs">
          Esta especificación técnica u objeto de solución (FSO) está siendo documentado por nuestro equipo de ingeniería senior.
        </p>
        <div className="pt-4">
          <Link href="/" className="btn-outline-accent !py-2 inline-flex items-center gap-2 text-xs">
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
