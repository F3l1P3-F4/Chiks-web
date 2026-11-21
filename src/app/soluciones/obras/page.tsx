import { pageMetadata } from '@/lib/seo';
import SolutionDetail from '@/components/SolutionDetail';

export const metadata = pageMetadata('/soluciones/obras');

export default function Page() {
  return <SolutionDetail slug="obras" />;
}
