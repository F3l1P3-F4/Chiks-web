import Image from 'next/image';
import Breadcrumb from './Breadcrumb';
import Button from './Button';
import { solutionProfiles, solutionServiceLinks } from '@/data/solutionProfiles';
import Link from 'next/link';

export default function SolutionDetail({ slug }: { slug: keyof typeof solutionProfiles }) {
  const { title, items, photo, catalogHref } = solutionProfiles[slug];

  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb currentPath={`/soluciones/${slug}`} wrap items={[{ label: 'Soluciones', href: '/soluciones' }, { label: title }]} />
      <h1 className="mb-8">{title}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 mb-12">
        <div className="internal-surface relative aspect-[4/3] border border-divider">
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
        </div>
        <section aria-labelledby="servicios-perfil" className="internal-surface border border-divider p-6 md:p-8">
          <h2 id="servicios-perfil" className="text-2xl mb-5">Servicios</h2>
          <ul className="list-disc pl-5 space-y-3 text-gray-700">
            {items.map((item) => (
              <li key={item}>
                {solutionServiceLinks[slug][item]
                  ? <Link href={solutionServiceLinks[slug][item]} className="underline underline-offset-4 hover:text-brand">{item}</Link>
                  : item}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button href={catalogHref}>Ver catálogo</Button>
        <Button href="/contacto" variant="solid">Consultar en Contacto</Button>
      </div>
    </div>
  );
}
