import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SolutionCard.module.css';
import { PROFILE_PHOTOS } from '@/data/solutionProfiles';

interface SolutionCardProps {
  title: string;
  items: string[];
  href: string;
  variant?: 'default' | 'clubes' | 'empresas' | 'comercios' | 'eventos' | 'obras';
}

export default function SolutionCard({ title, items, href, variant = 'default' }: SolutionCardProps) {
  if (variant !== 'default') {
    const photo = PROFILE_PHOTOS[variant];
    return (
      <Link href={href} className={`${styles.profileCard} ${styles[variant]}`}>
        <div className={styles.photograph}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1536px) 280px, (min-width: 640px) 340px, 100vw"
            className={styles.photo}
            style={{ objectPosition: photo.position }}
          />
        </div>
        <div className={styles.panel}>
          <svg className={styles.curve} viewBox="0 0 320 64" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 64C0 18 58 26 130 30C220 38 288 32 320 0V64Z" fill="white" />
            <path d="M0 64C0 18 58 26 130 30C220 38 288 32 320 0" fill="none" stroke="var(--outline)" strokeWidth="3" />
          </svg>
          <h3 className={styles.title}>{title}</h3>
          <ul className={styles.services}>
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <span className={styles.cta}>Ver solución <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="block group">
      <div className="internal-surface border border-divider p-8 h-full bg-white hover:border-brand hover:shadow-sm transition-all duration-300">
        <h3 className="text-2xl font-extrabold uppercase tracking-tighter mb-6 group-hover:text-brand transition-colors">
          {title}
        </h3>
        
        <ul className="space-y-3 mb-8">
          {items.map((item, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700">
              <span className="text-brand mr-3">✳</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-brand transition-colors">
          Ver Solución <span className="ml-2 font-normal">→</span>
        </div>
      </div>
    </Link>
  );
}
