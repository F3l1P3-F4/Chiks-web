import { existsSync } from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import nextConfig from '../../next.config';
import { trabajos } from '@/data/trabajos';
import styles from './WorkGallery.module.css';

export default function WorkGallery({ showTitle = true }: { showTitle?: boolean }) {
  return (
    <>
      {showTitle && <h2 id="trabajos-title" className={styles.title}>Trabajos realizados</h2>}
      <ul className={styles.grid}>
        {trabajos.map(({ fileName, alt, position }) => {
          // La exportación estática resuelve qué fotos existen al compilar.
          const available = existsSync(path.join(process.cwd(), 'public', 'images', 'trabajos', fileName));

          if (!available) return null;

          return (
            <li key={fileName} className={styles.frame}>
              <Image
                src={`${nextConfig.basePath ?? ''}/images/trabajos/${fileName}`}
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
