import styles from './WorkGallery.module.css';

interface SectionDividerProps {
  text: string;
  metadata?: string;
  id?: string;
}

export default function SectionDivider({ text, metadata, id }: SectionDividerProps) {
  return (
    <div className="mb-8 w-full text-center">
      <h2 id={id} className={styles.title}><span className="min-w-0 wrap-break-word">{text}</span></h2>
      {metadata && <p className="text-sm font-semibold tracking-wide text-gray-600">{metadata}</p>}
    </div>
  );
}
