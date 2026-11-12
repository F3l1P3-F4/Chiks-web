import Button from './Button';

export default function ProductConsultation() {
  return (
    <section aria-labelledby="consulta-producto" className="mt-auto">
      <h2 id="consulta-producto" className="text-xl mb-4">Consulta</h2>
      <div className="flex flex-wrap gap-4">
        <Button href="/contacto" className="w-full sm:w-auto max-w-full text-center">Consultar por WhatsApp</Button>
        <Button href="/contacto" variant="solid" className="w-full sm:w-auto max-w-full text-center">Solicitar presupuesto</Button>
      </div>
      <p className="mt-4 text-sm text-gray-600 leading-relaxed">Por ahora, ambas opciones abren la página de Contacto.</p>
    </section>
  );
}
