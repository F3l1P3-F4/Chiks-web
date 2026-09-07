import React from 'react';
import Link from 'next/link';

interface SolutionCardProps {
  title: string;
  items: string[];
  href: string;
}

export default function SolutionCard({ title, items, href }: SolutionCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="border border-divider p-8 h-full bg-white hover:border-brand hover:shadow-sm transition-all duration-300">
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
