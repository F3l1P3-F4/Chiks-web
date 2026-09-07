import React from 'react';

interface SectionDividerProps {
  text?: string;
  metadata?: string;
}

export default function SectionDivider({ text, metadata }: SectionDividerProps) {
  return (
    <div className="w-full border-t border-divider pt-4 pb-12 mb-4">
      {text && (
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-mono tracking-widest uppercase text-gray-500">
          <span>[ {text} ]</span>
          {metadata && (
            <>
              <span className="hidden md:inline">—</span>
              <span>{metadata}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
