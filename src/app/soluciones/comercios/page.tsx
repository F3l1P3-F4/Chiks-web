import { pageMetadata } from '@/lib/seo';
import SolutionDetail from '@/components/SolutionDetail';

export const metadata = pageMetadata('/soluciones/comercios');

export default function Page() {
  return <SolutionDetail slug="comercios" />;
}
