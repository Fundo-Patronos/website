const criterios = [
  {
    name: 'Objetivos, resultados esperados, organização e planejamento do projeto',
    description: 'Avaliamos a clareza dos objetivos, viabilidade dos resultados esperados e qualidade do planejamento apresentado.',
    date: 'Critério 1',
    dateTime: 'criterio-1',
  },
  {
    name: 'Impactos e benefícios para pessoas, instituições e a sociedade',
    description: 'Analisamos o potencial de impacto social, benefícios para a comunidade e contribuição para o desenvolvimento da sociedade.',
    date: 'Critério 2',
    dateTime: 'criterio-2',
  },
  {
    name: 'Escalabilidade e parceria com o Patronos',
    description: 'Consideramos o potencial de crescimento do projeto e as oportunidades de colaboração estratégica com o Fundo Patronos.',
    date: 'Critério 3',
    dateTime: 'criterio-3',
  },
]

export default function CriteriosAvaliacao() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Critérios de Avaliação
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">Nossos projetos são avaliados com base em critérios rigorosos que garantem impacto e excelência.</p>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {criterios.map((item) => (
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