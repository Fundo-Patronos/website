const timeline = [
  {
    name: 'Critérios de Seleção',
    description:
      'De acordo com o regulamento do edital',
    date: 'Etapa 1',
    dateTime: 'etapa-1',
  },
  {
    name: 'Análise Eliminatória',
    description:
      'Serão analisadas apenas as aplicações que estejam completas',
    date: 'Etapa 2',
    dateTime: 'etapa-2',
  },
  {
    name: 'Matching',
    description:
      'Duplas de mentores e alunos serão formadas correspondendo objetivos de carreira e especialidades',
    date: 'Etapa 3',
    dateTime: 'etapa-3',
  },
  {
    name: 'Divulgação das Duplas',
    description:
      'Realizada através do nosso portal e nossas redes sociais',
    date: 'Etapa 4',
    dateTime: 'etapa-4',
  },
]

export default function SelecaoAvaliacao() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Seleção e Avaliação
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">Processo estruturado para garantir o melhor matching entre mentores e estudantes.</p>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {timeline.map((item) => (
            <div key={item.name}>
              <time dateTime={item.dateTime} className="flex items-center text-sm/6 font-semibold" style={{color: '#ff9700'}}>
                <svg viewBox="0 0 4 4" aria-hidden="true" className="mr-4 size-1 flex-none">
                  <circle r={2} cx={2} cy={2} fill="currentColor" />
                </svg>
                {item.date}
                <div
                  aria-hidden="true"
                  className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                />
              </time>
              <p className="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900">{item.name}</p>
              <p className="mt-1 text-base/7 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}