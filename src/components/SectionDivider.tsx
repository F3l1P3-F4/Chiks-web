import styles from './WorkGallery.module.css';

interface SectionDividerProps {
  text: string;
  metadata?: string;
  id?: string;
  heading?: 'h2' | 'p';
}

export default function SectionDivider({ text, metadata, id, heading: Heading = 'h2' }: SectionDividerProps) {
  return (
    <div className="mb-8 w-full text-center">
      <Heading id={id} className={`${styles.title} font-extrabold uppercase tracking-[-0.02em]`}><span className="min-w-0 wrap-break-word">{text}</span></Heading>
      {metadata && <p className="text-sm font-semibold tracking-wide text-gray-600">{metadata}</p>}
    </div>
  );
}
