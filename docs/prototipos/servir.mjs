// Servidor local de revisión: no forma parte de Next.js ni de su exportación.
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const prototypeRoot = path.dirname(fileURLToPath(import.meta.url));
const imagesRoot = path.resolve(prototypeRoot, '../../public/images');
const port = Number(process.argv[2] ?? 3102);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Usá un puerto entre 1024 y 65535.');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png' };

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405).end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end(); return; }
  const image = pathname.startsWith('/public/images/');
  const root = image ? imagesRoot : prototypeRoot;
  const relative = image ? pathname.slice('/public/images/'.length) : pathname === '/' ? 'index.html' : pathname.slice(1);
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep) || !types[path.extname(target)] || !existsSync(target) || !statSync(target).isFile()) { response.writeHead(404).end(); return; }
  response.setHeader('Content-Type', types[path.extname(target)]);
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (request.method === 'HEAD') { response.end(); return; }
  createReadStream(target).pipe(response);
});
server.on('error', (error) => { console.error(error.code === 'EADDRINUSE' ? `El puerto ${port} ya está ocupado. Elegí otro puerto como argumento.` : error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`F02 disponible en http://localhost:${port}/ — Ctrl+C para detener.`));
