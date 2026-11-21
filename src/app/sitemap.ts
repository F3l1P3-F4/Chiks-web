import type { MetadataRoute } from 'next';
import { seoPages } from '@/lib/seo';
import { absoluteUrl } from '@/lib/siteUrl';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return seoPages.map(({ path }) => ({ url: absoluteUrl(path) }));
}
