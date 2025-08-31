const timeline = [
  {
    name: 'Fundação do Fundo',
    description:
      'Criação oficial do Fundo Patrimonial Patronos com o objetivo de fortalecer a pesquisa, ensino e extensão na Unicamp através de investimentos sustentáveis.',
    date: 'Jan 2020',
    dateTime: '2020-01',
  },
  {
    name: 'Primeiros Projetos Apoiados',
    description:
      'Início do financiamento de projetos inovadores em diversas áreas do conhecimento, beneficiando estudantes e pesquisadores da Unicamp.',
    date: 'Ago 2020',
    dateTime: '2020-08',
  },
  {
    name: 'R$ 10 Milhões Arrecadados',
    description:
      'Marco importante na captação de recursos, demonstrando a confiança da sociedade no potencial transformador da educação superior.',
    date: 'Mar 2022',
    dateTime: '2022-03',
  },
  {
    name: 'Expansão dos Programas',
    description:
      'Ampliação dos programas de bolsas e apoio à infraestrutura, consolidando o Fundo como referência em investimento educacional no Brasil.',
    date: 'Dez 2023',
    dateTime: '2023-12',
  },
]

export default function FundoTimeline() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Nossa Trajetória
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Conheça os marcos importantes que consolidaram o Fundo Patrimonial Patronos como uma força transformadora na educação superior brasileira.
          </p>
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