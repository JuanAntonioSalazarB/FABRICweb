"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DiagnosticoWizardView from '@/components/modals/DiagnosticoWizardView';

export default function DiagnosticoPage() {
  const router = useRouter();

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-mono text-xs mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>

        <div className="card-premium p-6 md:p-8">
          <DiagnosticoWizardView onBookingLinkClick={() => router.push('/office-hours')} />
        </div>
      </div>
    </div>
  );
}
