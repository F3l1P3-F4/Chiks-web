import { existsSync } from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import nextConfig from '../../next.config';
import { trabajos } from '@/data/trabajos';
import styles from './WorkGallery.module.css';

export default function WorkGallery() {
  return (
    <>
      <h2 id="trabajos-title" className={styles.title}>Trabajos realizados</h2>
      <ul className={styles.grid}>
        {trabajos.map(({ fileName, alt }) => {
          // La exportación estática resuelve qué fotos existen al compilar.
          const available = existsSync(path.join(process.cwd(), 'public', 'images', 'trabajos', fileName));

          return (
            <li key={fileName} className={styles.frame}>
              {available ? (
                <Image
                  src={`${nextConfig.basePath ?? ''}/images/trabajos/${fileName}`}
                  alt={alt}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 480px) 50vw, 100vw"
                  className={styles.image}
                />
              ) : (
                <span className={styles.placeholder}>Imagen pendiente</span>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
