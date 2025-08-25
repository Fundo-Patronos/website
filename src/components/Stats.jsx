export default function Stats() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            Nosso Impacto na Unicamp e na Sociedade
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Desde nossa fundação, trabalhamos incansavelmente para fortalecer a educação superior brasileira, 
            apoiando projetos que transformam vidas e geram conhecimento para toda a sociedade.
          </p>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
            <p className="flex-none text-3xl font-bold tracking-tight text-gray-900">150+</p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className="text-xl font-semibold tracking-tight text-gray-900">Projetos Apoiados</p>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Iniciativas de ensino, pesquisa e extensão que beneficiam milhares de pessoas.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-blue-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
            <p className="flex-none text-3xl font-bold tracking-tight text-white">R$ 25 milhões</p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className="text-xl font-semibold tracking-tight text-white">
                Total investido em projetos que fortalecem o ensino, pesquisa e extensão na Unicamp.
              </p>
              <p className="mt-2 text-base leading-7 text-blue-200">
                Recursos direcionados para bolsas, equipamentos, infraestrutura e programas inovadores.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-blue-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
            <p className="flex-none text-3xl font-bold tracking-tight text-white">50.000+</p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className="text-xl font-semibold tracking-tight text-white">Vidas Impactadas</p>
              <p className="mt-2 text-base leading-7 text-blue-200">
                Entre estudantes beneficiados, comunidades atendidas e profissionais formados através dos projetos apoiados pelo fundo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}