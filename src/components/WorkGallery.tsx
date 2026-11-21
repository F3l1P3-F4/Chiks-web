import Image from 'next/image';
import { trabajos } from '@/data/trabajos';
import styles from './WorkGallery.module.css';

export default function WorkGallery({ showTitle = true }: { showTitle?: boolean }) {
  return (
    <>
      {showTitle && <h2 id="trabajos-title" className={styles.title}>Trabajos realizados</h2>}
      <ul className={styles.grid}>
        {trabajos.map(({ src, alt, position }) => {
          return (
            <li key={src.src} className={styles.frame}>
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 480px) 50vw, 100vw"
                className={styles.image}
                style={{ objectPosition: position }}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
