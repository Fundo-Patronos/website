export default function ExtrasCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          As inscrições do Edital Decola Extras 2027 foram encerradas.
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href="/EDITAL DECOLA EXTRAS 2027.pdf"
            download
            className="text-sm/6 font-semibold text-gray-900"
          >
            Ver Regulamento <span aria-hidden="true">→</span>
          </a>
          <a
            href="/TEMPLATE Cronograma Físico Financeiro 2027.xlsx"
            download
            className="text-sm/6 font-semibold text-gray-900"
          >
            Cronograma Físico-Financeiro <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}