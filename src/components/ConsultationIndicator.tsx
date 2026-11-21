'use client';

import { useConsultation } from './ConsultationProvider';
import Link from 'next/link';

interface ConsultationIndicatorProps {
  onNavigate?: () => void;
}

export default function ConsultationIndicator({ onNavigate }: ConsultationIndicatorProps) {
  const { items, ready } = useConsultation();
  return (
    <Link href="/mi-consulta" onNavigate={onNavigate} aria-label={`Mi consulta (${ready ? items.length : 0})`}
      className="shrink-0 rounded-full border border-[#07134b]/20 px-2 py-2 text-center text-xs font-semibold leading-tight text-[#07134b]">
      <span role="status" aria-live="polite" aria-atomic="true">Mi consulta ({ready ? items.length : 0})</span>
    </Link>
  );
}
