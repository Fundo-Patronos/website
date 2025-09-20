export default function FundoHero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-red-100/20 pt-14">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-red-600/10 ring-red-50 sm:-mr-80 lg:-mr-96"
      />
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
          <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl lg:col-span-2 xl:col-auto">
            Construindo o futuro da Unicamp
          </h1>
          <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
            <p className="text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              O Patronos da Unicamp é o fundo patrimonial da Universidade Estadual de Campinas (Unicamp), dedicado a avançar a missão acadêmica da universidade. Apoiamos pesquisas pioneiras, empreendedorismo e iniciativas extracurriculares que enriquecem a experiência estudantil e impulsionam a inovação.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="https://doa.re/patronos"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)', focusVisibleOutlineColor: '#ff9700'}}
              >
                Fazer Doação
              </a>
              <a href="#nossa-trajetoria" className="text-sm/6 font-semibold text-gray-900">
                Nossa História <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <img
            alt="Pesquisa e desenvolvimento na Unicamp"
            src="/Illustrative Pictures/Research.jpg"
            className="aspect-6/5 w-full max-w-lg rounded-2xl object-cover object-center outline-1 -outline-offset-1 outline-black/5 lg:max-w-none xl:row-span-2 xl:row-end-2"
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
    </div>
  )
}