import type { ReactNode } from 'react';

export default function CatalogIntro({ title, context, metadata, children }: {
  title: string;
  context: string;
  metadata: string;
  children: ReactNode;
}) {
  return (
    <header className="max-w-4xl mb-10">
      <h1 className="mb-6">{title}</h1>
      <p className="max-w-[65ch] text-xl text-gray-600 leading-relaxed">{children}</p>
      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold tracking-wide text-gray-500">
        <span>{context}</span>
        <span>{metadata}</span>
      </p>
    </header>
  );
}
