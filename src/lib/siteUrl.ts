// URL publicada y verificada. SITE_URL debe incluir el subdirectorio, si existe.
export const siteUrl = new URL(process.env.SITE_URL ?? 'https://f3l1p3-f4.github.io/Chiks-web/');

export function absoluteUrl(path: string) {
  return siteUrl.href.replace(/\/$/, '') + (path === '/' ? '/' : path);
}
