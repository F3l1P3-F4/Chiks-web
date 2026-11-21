import { pageMetadata } from '@/lib/seo';
import SolutionDetail from '@/components/SolutionDetail';

export const metadata = pageMetadata('/soluciones/clubes-y-equipos');

export default function Page() {
  return <SolutionDetail slug="clubes-y-equipos" />;
}
