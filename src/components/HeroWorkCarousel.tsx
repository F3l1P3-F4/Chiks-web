'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { trabajos } from '@/data/trabajos';
import styles from './HeroWorkCarousel.module.css';

interface SlideState {
  current: number;
  previous: number | null;
  ready: boolean;
  animate: boolean;
  failed: boolean;
}

const viewportId = 'hero-fotografias';
// Acerca el encuadre al estampado del bolsillo sin cambiar la galería interna.
const heroPosition = (photo: typeof trabajos[number]) => photo === trabajos[0] ? '75% 60%' : photo.position;

export default function HeroWorkCarousel() {
  const [slide, setSlide] = useState<SlideState>({ current: 0, previous: null, ready: true, animate: false, failed: false });
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const current = trabajos[slide.current];
  const previous = slide.previous === null ? null : trabajos[slide.previous];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    function stopMotion() {
      if (!document.hidden && !media.matches) return;
      setSlide((state) => state.animate ? { ...state, animate: false, previous: state.ready ? null : state.previous } : state);
    }
    document.addEventListener('visibilitychange', stopMotion);
    media.addEventListener('change', stopMotion);
    return () => { document.removeEventListener('visibilitychange', stopMotion); media.removeEventListener('change', stopMotion); };
  }, []);

  function select(index: number) {
    const animate = !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setSlide((state) => state.current === index ? state : {
      current: index,
      previous: state.ready && !state.failed ? state.current : state.previous,
      ready: false,
      animate,
      failed: false,
    });
  }

  function move(direction: -1 | 1) {
    select((slide.current + direction + trabajos.length) % trabajos.length);
  }

  function reveal(index: number) {
    setSlide((state) => state.current !== index ? state : { ...state, ready: true, previous: state.animate ? state.previous : null });
  }

  function finish(index: number) {
    setSlide((state) => state.current !== index || !state.ready ? state : { ...state, animate: false, previous: null });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') select(0);
    else if (event.key === 'End') select(trabajos.length - 1);
    else move(event.key === 'ArrowLeft' ? -1 : 1);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx < 0 ? 1 : -1);
  }

  return <div className={styles.carousel}>
    <div id={viewportId} className={styles.viewport} tabIndex={0} role="group" aria-roledescription="carrusel" aria-label="Fotografías de trabajos realizados" aria-describedby={`${viewportId}-ayuda`} aria-busy={!slide.ready}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => { if (event.pointerType !== 'mouse' && event.isPrimary) gesture.current = { x: event.clientX, y: event.clientY }; }}
      onPointerUp={onPointerUp} onPointerCancel={() => { gesture.current = null; }}>
      {previous && <Image key={`previous-${slide.previous}`} src={previous.src} alt="" aria-hidden="true" fill loading="eager" sizes="(min-width: 1440px) 650px, (min-width: 768px) 48vw, 100vw" draggable={false}
        className={`${styles.image} ${styles.previous} ${slide.ready && slide.animate ? styles.exit : ''}`} style={{ objectPosition: heroPosition(previous) }} />}
      {!slide.failed ? <Image key={`current-${slide.current}`} src={current.src} alt={current.alt} fill preload={slide.current === 0} loading={slide.current === 0 ? undefined : 'eager'}
        sizes="(min-width: 1440px) 650px, (min-width: 768px) 48vw, 100vw" draggable={false}
        className={`${styles.image} ${slide.ready ? slide.animate ? styles.enter : '' : styles.waiting}`} style={{ objectPosition: heroPosition(current) }}
        onLoad={() => reveal(slide.current)} onAnimationEnd={() => finish(slide.current)}
        onError={() => setSlide((state) => state.current !== slide.current ? state : { ...state, ready: true, failed: true, previous: null, animate: false })} />
        : <div className={styles.fallback} role="img" aria-label={current.alt}><span>Fotografía no disponible</span><small>Podés explorar los otros trabajos con las flechas.</small></div>}
    </div>
    <p id={`${viewportId}-ayuda`} className="sr-only">Usá las flechas izquierda y derecha, Inicio o Fin para cambiar de fotografía. En celular también podés deslizar horizontalmente. No hay reproducción automática.</p>
    <div className={styles.footer}>
      <p className={styles.position} role="status" aria-live="polite" aria-atomic="true">
        <span className="sr-only">{slide.ready ? 'Fotografía' : 'Cargando fotografía'} </span>{String(slide.current + 1).padStart(2, '0')} <span aria-hidden="true">/</span><span className="sr-only"> de </span> {String(trabajos.length).padStart(2, '0')}
        <span className="sr-only">. {current.alt}{slide.failed ? '. Fotografía no disponible.' : ''}</span>
      </p>
      <Link href="/trabajos-realizados" className={styles.allWorks}>Ver trabajos<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></Link>
      <div className={styles.controls} role="group" aria-label="Controles de fotografías del hero">
        <button type="button" className={styles.control} aria-label="Fotografía anterior" aria-controls={viewportId} onClick={() => move(-1)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7" /></svg></button>
        <button type="button" className={styles.control} aria-label="Fotografía siguiente" aria-controls={viewportId} onClick={() => move(1)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 5 7 7-7 7" /></svg></button>
      </div>
    </div>
  </div>;
}
