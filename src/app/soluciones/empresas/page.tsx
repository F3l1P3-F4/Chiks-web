import { pageMetadata } from '@/lib/seo';
import SolutionDetail from '@/components/SolutionDetail';

export const metadata = pageMetadata('/soluciones/empresas');

export default function Page() {
  return <SolutionDetail slug="empresas" />;
}
