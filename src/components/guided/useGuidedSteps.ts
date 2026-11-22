'use client';

import { useRef, useState } from 'react';

export interface GuidedStepError { id: string; message: string }

// Solo controla el recorrido de prueba y su foco. Cada producto valida sus datos.
export function useGuidedSteps({ idPrefix, steps, validateStep, resetSelection }: {
  idPrefix: string;
  steps: readonly string[];
  validateStep: (index: number) => GuidedStepError | null;
  resetSelection: () => void;
}) {
  const [step, setStep] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const [error, setError] = useState<GuidedStepError | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const reviewTitle = useRef<HTMLHeadingElement>(null);

  function moveStep(index: number) {
    setStep(index);
    setReviewed(false);
    setError(null);
    setAnnouncement(`Paso ${index + 1}: ${steps[index]}.`);
    requestAnimationFrame(() => { stepTitle.current?.focus({ preventScroll: true }); stepTitle.current?.scrollIntoView({ block: 'start' }); });
  }

  function showError(index: number, problem: GuidedStepError) {
    setStep(index);
    setReviewed(false);
    setError(problem);
    requestAnimationFrame(() => document.getElementById(problem.id)?.focus());
  }

  function next() {
    if (step < steps.length - 1) {
      const problem = validateStep(step);
      if (problem) showError(step, problem);
      else moveStep(step + 1);
      return;
    }
    for (let index = 0; index < steps.length; index++) {
      const problem = validateStep(index);
      if (problem) { showError(index, problem); return; }
    }
    setError(null);
    setReviewed(true);
    setAnnouncement('Selección de ejemplo lista para revisar. No se guardó ni se envió.');
    requestAnimationFrame(() => { reviewTitle.current?.focus(); reviewTitle.current?.scrollIntoView({ block: 'start' }); });
  }

  function reset() {
    resetSelection();
    setStep(0);
    setReviewed(false);
    setError(null);
    setAnnouncement('Demostración reiniciada. La consulta comercial no cambió.');
    requestAnimationFrame(() => document.getElementById(`${idPrefix}-title`)?.focus());
  }

  return { step, reviewed, error, announcement, stepTitle, reviewTitle, moveStep, next, reset, clearError: () => setError(null), setAnnouncement };
}
