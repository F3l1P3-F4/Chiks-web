import { copyFile, mkdir, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Next 16.3.4 exporta en Windows algunas rutas de segmentos con separadores
// del sistema. El cliente solicita el nombre plano con puntos en su lugar.
// Solo agrega esos nombres al resultado de exportación. En Linux no hay nada
// que corregir y se conserva el flujo habitual de GitHub Pages.
const outputDirectory = path.resolve('out');
const files = await readdir(outputDirectory, { recursive: true, withFileTypes: true });
let copied = 0;

for (const file of files) {
  if (!file.isFile() || !file.name.endsWith('.txt')) continue;

  const source = path.join(file.parentPath, file.name);
  const segments = path.relative(outputDirectory, source).split(path.sep);
  const segmentIndex = segments.findIndex((segment) => segment.startsWith('__next.'));
  if (segmentIndex < 0 || segmentIndex === segments.length - 1) continue;

  const destination = path.join(
    outputDirectory,
    ...segments.slice(0, segmentIndex),
    segments.slice(segmentIndex).join('.'),
  );
  const content = await readFile(source);
  let existing;
  try {
    existing = await readFile(destination);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (existing) {
    if (!existing.equals(content)) {
      throw new Error(`Segmentos incompatibles en ${destination}`);
    }
    continue;
  }

  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
  copied++;
}

console.log(`Exportación estática verificada. ${copied} nombres de segmentos normalizados.`);
