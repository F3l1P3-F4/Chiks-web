import Button from './Button';

export default function ProductConsultation({ selectionFormId, disabled }: { selectionFormId: string; disabled: boolean }) {
  return (
    <section aria-labelledby="consulta-producto" className="mt-auto">
      <h2 id="consulta-producto" className="text-xl mb-4">Consulta</h2>
      <div className="flex flex-wrap gap-4">
        <Button href="/contacto" className="w-full sm:w-auto max-w-full text-center">Consultar en Contacto</Button>
        <Button type="submit" form={selectionFormId} name="selectionAction" value="budget" disabled={disabled} aria-describedby={`${selectionFormId}-status`} variant="solid" className="w-full sm:w-auto max-w-full text-center disabled:opacity-50">Solicitar presupuesto</Button>
      </div>
      <p className="mt-4 text-sm text-gray-600 leading-relaxed">Podés agregar el producto o pulsar «Solicitar presupuesto» para guardar esta selección y revisar tu consulta.</p>
    </section>
  );
}
